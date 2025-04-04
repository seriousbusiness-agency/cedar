/*!
 * MotherLoader: 0.3.1
 * http://andreponce.com
 *
 */

import { toFixed } from '@common/math/function'
import {
	canUseAvif,
	canUseWebP,
	createElement,
	delayedCall,
	destroyInstance,
	each,
	getExtension,
	getScreenSize,
	query,
	queryAll,
	searchInManifest,
	setAttributesNS
} from '@common/util/function'
import EventEmitter from 'events'

const PNGPlaceHolder =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
const SVGPlaceHolder =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+'
const LOOK_FOR_ELEMENTS = ['img', 'video', 'object', 'use', 'image', 'audio']
const CURRENT_SRC_ELEMENTS = ['img', 'video', 'audio']

const SCREEN_SIZE = getScreenSize()
let webPSupport
let avifSupport
canUseWebP().then((res) => {
	webPSupport = res
})
canUseAvif().then((res) => {
	avifSupport = res
})

export default class MotherLoader extends EventEmitter {
	verbose
	queue
	#baseURL
	#assetsByPath = {}
	#assetsById = {}
	#loading = false
	#abortController = new AbortController()
	#loaders = []
	assets = []
	waitingScan = []
	started = false
	complete = false
	progress = 0
	readyToStart

	constructor(props) {
		super()
		const { verbose, queue, baseURL } = props || {}
		const base = query('base')
		let baseHref = baseURL
			? (!baseURL.includes('http') ? window.location.protocol : '') + baseURL
			: (base ? base.href : null) || window.location.origin
		baseHref += baseHref.slice(-1) !== '/' ? '/' : ''
		this.#baseURL = new URL(baseHref)
		this.verbose = verbose
		this.queue = queue

		this.#log('MotherLoader::constructor(👩) ', this)
	}

	/**
	 *
	 * @param {HTMlElement} el
	 */
	scan = (el, props = {}) => {
		// setTimeout -> fix safari delay to read currentSrc
		this.#log('MotherLoader::scan() ', el, props)
		if (!el) return
		this.#log('-------------- scanning')
		let { lookFor } = props
		lookFor = lookFor || LOOK_FOR_ELEMENTS
		const ignoredElements = [...queryAll(`[ignoreloader] ${lookFor.join(', [ignoreloader] ')}`, el)]
		let elements = [...queryAll(lookFor.join(','), el)]

		this.waitingScan.push(el)

		this.readyToStart = false

		const promise = new Promise((resolve) => {
			const checkSources = () => {
				console.log('checkSources()')
				const notOkElements = []

				each(elements, (currentEl) => {
					const { ignoreLoader, loading, responsive, bestformat, weight } = currentEl.attributes
					if (
						ignoreLoader ||
						(loading && loading.value === 'lazy') ||
						ignoredElements.includes(currentEl) ||
						elements.includes(currentEl.parentNode)
					) {
						return
					}

					const tagName = currentEl.tagName.toLowerCase()
					if (
						CURRENT_SRC_ELEMENTS.includes(tagName) &&
						!currentEl.currentSrc &&
						((tagName === 'img' && (currentEl.srcset || currentEl.parentNode.tagName.toLowerCase() === 'picture')) ||
							tagName !== 'img')
					) {
						notOkElements.push(currentEl)
						return
					}
					let src =
						currentEl.currentSrc ||
						currentEl.src ||
						(currentEl.href
							? currentEl.href.baseVal || (typeof currentEl.href === 'string' ? currentEl.href : null)
							: null) ||
						currentEl.data

					const hasSrc = Boolean(src)
					if (hasSrc && src.charAt(0) === '#') return
					src = src || currentEl.getAttribute('from')
					if (!src) {
						console.warn('This element does not have a source url', currentEl)
						return
					}

					const myProps = { ...props }
					myProps.resposive = responsive ? responsive.value === 'true' : myProps.resposive
					myProps.bestFormat = bestformat ? bestformat.value === 'true' : myProps.bestFormat
					myProps.weight = weight ? parseFloat(weight.value) : 1

					currentEl.onload = null
					currentEl.onerror = null
					currentEl.removeAttribute('from')

					if (hasSrc) this.#resetPath(currentEl)
					if (['audio'].includes(tagName)) myProps.resposive = false

					this.add(src, { id: currentEl.id || src, el: currentEl, ...myProps })
				})

				if (!notOkElements.length) {
					this.#log('-------------- end scan')
					window.cancelAnimationFrame(timer)
					this.readyToStart = true
					resolve()
					this.waitingScan = this.waitingScan.filter((currentEl) => currentEl !== el)
					if (!this.waitingScan.length) {
						this.#dispatchEvent('ready')
						if (this.started) this.start()
					}
				} else elements = notOkElements
			}

			const timer = window.requestAnimationFrame(checkSources)
		})

		return promise
	}

	/**
	 *
	 * @param {*} url
	 * @param {*} props
	 */
	add = (filename, props = {}) => {
		if (!filename || this.#loading) {
			if (this.#loading) console.warn('You cannot add new assets to the queue while loading is in progress.')
			else console.warn('Filename is empty')
			return this
		}
		const { fetchInit, bestFormat, resposive, formatType, path, weight, retry } = props
		props.id = props.id || filename
		const baseHref = filename.includes('http')
			? filename.includes(this.#baseURL.href)
				? this.#baseURL.href
				: undefined
			: this.#baseURL.href
		const normalizedOriginalPath = `${path ? `${path}/` : ''}${filename}`
		// console.log(normalizedOriginalPath, filename)
		const tempUrl = new URL(normalizedOriginalPath, baseHref)
		let { pathname } = tempUrl
		let extension = getExtension(pathname)
		const fileIndex = extension ? pathname.lastIndexOf('/') : pathname.length
		const originalFileName = extension ? pathname.slice(fileIndex + 1) : ''

		pathname = pathname.slice(0, fileIndex)
		const pathList = pathname.replace(this.#baseURL.pathname, '').replace(/^\/+/, '').split('/').filter(Boolean)
		pathname = pathList.join('/')

		let finalFileName = originalFileName

		if (extension) {
			const isStaticImage = ['png', 'jpg', 'jpeg'].includes(extension)
			if (isStaticImage || formatType === 'video') {
				const newExtension =
					bestFormat && isStaticImage ? (avifSupport ? 'avif' : webPSupport ? 'webp' : extension) : extension
				const regexp = /@.x/gm
				const fileSize = `@${SCREEN_SIZE}x`
				const match = finalFileName.match(regexp)
				if (resposive) {
					finalFileName = match
						? finalFileName.replace(regexp, fileSize)
						: finalFileName.replace(`.${extension}`, `${fileSize}.${extension}`)
					// finalFileName = match ? finalFileName.replace(new RegExp(`(?<=${fileSize})(.*)(?=.${extension})`, 'gm'), '') : finalFileName;
					finalFileName = match
						? finalFileName.replace(finalFileName.match(`${fileSize}(.*).${extension}`)[1], '')
						: finalFileName
				}
				finalFileName = finalFileName.replace(`.${extension}`, `.${newExtension}`)
				extension = newExtension
			}
		}
		finalFileName = searchInManifest(finalFileName, pathList) || originalFileName

		// this.verbose = true;
		// this.#log(filename, pathArr, url);
		// this.verbose = false;
		const uniquePath = `${(baseHref || `${tempUrl.origin}/`) + pathname}/${finalFileName}${tempUrl.search}`
		const finalURL = new URL(normalizedOriginalPath.replace(originalFileName, finalFileName), baseHref)
		const assetsArr = this.#assetsByPath[uniquePath]
		props.path = props.path || pathList.join('/')
		props.weight = weight || 1
		props.retry = retry !== undefined ? retry : true

		const data = {
			originalPath: normalizedOriginalPath,
			filename: finalFileName,
			extension,
			uniquePath,
			pathList,
			url: finalURL,
			...props
		}

		if (!data.el && (!fetchInit || (fetchInit && formatType))) {
			let tagName
			const type = formatType || extension
			switch (type) {
				case 'image':
				case 'png':
				case 'jpg':
				case 'jpeg':
				case 'gif':
				case 'webp':
				case 'avif':
					tagName = 'img'
					break
				case 'svg':
					tagName = 'object'
					break
				case 'video':
					tagName = 'video'
					break
				case 'audio':
				case 'mp3':
				case 'wav':
				case 'aac':
				case 'ogg':
				case 'ogv':
				case 'webm':
				case 'mp4':
					tagName = 'audio'
					break
				default:
			}
			data.el = tagName ? createElement(tagName) : null
		}

		if (!assetsArr) {
			this.#log('Added to Loader: ', data)
			this.#assetsByPath[uniquePath] = [data]
			this.assets.push(data)
		} else {
			this.#log('---> Repeated Asset: ', data)
			assetsArr.push(data)
		}

		this.set(props.id, data)
		// this.#assetsById[props.id] = data

		return this
	}

	#dispatchEvent = (type, data, progress) => {
		try {
			this.emit(type, data, progress)
		} catch (e) {
			console.log(e)
		}
	}

	#log = (...args) => {
		if (this.verbose) {
			console.log(...args)
		}
	}

	start = () => {
		if (this.complete) {
			console.warn('The loader has already been completed.')
			return
		}
		this.started = true
		if (this.waitingScan.length || this.#loading) return this
		this.#log('MotherLoader::start(🚀) ')
		this.#log('-------------- start loading')
		this.#loading = true

		const totalWeight = this.assets.reduce((accumulator, data) => accumulator + data.weight, 0)
		let weightLoaded = 0
		let assetsLoaded = 0
		const getPct = () => toFixed(weightLoaded, 3) / toFixed(totalWeight, 3)
		let pct = 0
		let errors = 0
		const checkProgress = () => {
			this.progress = pct
			if (pct === 1) {
				this.complete = true
				this.started = false
				this.#loading = false
				this.#log(
					`-------------- ${errors ? '💩💩💩 Load complete, but there were some errors!' : '✅ ✅ ✅ 🙌 Complete ALL!'}`
				)
				this.#dispatchEvent('complete_all', null, pct)
			} else if (this.queue) load(this.assets[assetsLoaded])
		}
		const load = (data, attempt = 0) => {
			if (!data) return
			let { el } = data

			const {
				uniquePath,
				fullLoad,
				crossorigin,
				mimeType,
				responseType,
				fetchInit,
				onStart,
				onComplete,
				onError,
				retry
			} = data

			const onLoadHandler = () => {
				weightLoaded += data.weight
				assetsLoaded++
				pct = getPct()
				this.#log('✅ Load complete', data, ` Progress: ${pct * 100}%`)
				this.#dispatchEvent('progress', data, pct)
				if (onComplete) onComplete(data)
				this.#dispatchEvent('complete', data, pct)
				checkProgress()
			}
			const onErrorHandler = () => {
				this.#resetPath(el)

				pct = getPct()
				// console.log('erro', data);
				this.#log('❌ Error', data, ` Progress: ${pct * 100}%`)
				if (onError) onError(data)
				this.#dispatchEvent('error', data, pct)
				this.#dispatchEvent('progress', data, pct)

				if (retry) {
					this.#log('🤷‍♀️ Trying to load again ...', data)
					delayedCall(() => load(data, ++attempt), 200)
				} else {
					weightLoaded += data.weight
					assetsLoaded++
					errors++
					checkProgress()
				}
			}
			const applyPaths = () => {
				each(this.#assetsByPath[data.uniquePath], (currentData) => {
					const { el: currentEl } = currentData
					if (currentEl) {
						const tagName = currentEl.tagName.toLowerCase()
						const fullPath =
							(currentData.responseType === 'blob' ? URL.createObjectURL(currentData.result) : currentData.url.href) +
							(attempt ? `?attempt=${attempt}` : '')

						switch (tagName) {
							case 'script':
							case 'link':
								query('body').appendChild(currentEl)
								break
							default:
						}

						switch (tagName) {
							case 'object':
								currentEl.data = fullPath
								break
							case 'use':
								setAttributesNS(currentEl, { href: fullPath })
								break
							case 'image':
							case 'link':
								currentEl.setAttribute('href', fullPath)
								break
							default:
								currentEl.src = fullPath
						}
					}
				})
			}

			if (el && !fetchInit) {
				const tagName = el.tagName.toLowerCase()

				if (attempt) {
					switch (tagName) {
						case 'script':
						case 'link':
							{
								const lastEl = el
								lastEl.remove()
								const attributes = {}
								each(Object.keys(el.attributes), (key) => {
									const atttibute = el.attributes[key]
									if (atttibute.name !== 'src' && atttibute.name !== 'href')
										attributes[atttibute.name] = atttibute.value
								})
								el = createElement(tagName, attributes)
								data.el = el
							}
							break
						default:
					}
				}

				if (crossorigin) el.setAttribute('crossorigin', crossorigin)
				// el.onerror = _onError;

				let loaderEl = el
				switch (tagName) {
					case 'video':
					case 'audio':
						if (el.duration > 0) onLoadHandler()
						else {
							el.addEventListener(fullLoad ? 'canplaythrough' : 'loadedmetadata', onLoadHandler, {
								once: true,
								signal: this.#abortController.signal
							})
						}
						break
					case 'use':
					case 'object':
					case 'image':
						{
							const fakeImg = new Image()
							fakeImg.addEventListener('load', onLoadHandler, {
								once: true,
								signal: this.#abortController.signal
							})
							fakeImg.src = uniquePath
							loaderEl = fakeImg
						}
						break
					default:
						el.addEventListener('load', onLoadHandler, {
							once: true,
							signal: this.#abortController.signal
						})
				}
				loaderEl.addEventListener('error', onErrorHandler, {
					once: true,
					signal: this.#abortController.signal
				})
				this.#loaders.push(loaderEl)
			} else {
				fetch(
					new Request(uniquePath, {
						...fetchInit,
						signal: this.#abortController.signal
					})
				)
					.then((response) => {
						if (response.ok) {
							switch (responseType) {
								case 'arraybuffer':
									return response.arrayBuffer()

								case 'blob':
									return response.blob()

								case 'document':
									return response.text().then((text) => {
										const parser = new DOMParser()
										return parser.parseFromString(text, mimeType || 'application/xhtml+xml')
									})

								case 'json':
									return response.json()

								default: {
									if (mimeType === undefined) {
										return response.text()
									}
									const re = /charset="?([^;"\s]*)"?/i
									const exec = re.exec(mimeType)
									const label = exec && exec[1] ? exec[1].toLowerCase() : undefined
									const decoder = new TextDecoder(label)
									return response.arrayBuffer().then((ab) => decoder.decode(ab))
								}
							}
						} else {
							console.error('Network response was not ok.')
							return Promise.reject(response)
						}
					})
					.catch((e) => {
						data.result = e
						console.error(`There has been a problem with your fetch operation: ${e.message}`)
						if (e.message !== 'AbortError' && e.message !== 'signal is aborted without reason') onErrorHandler()
					})
					.then((result) => {
						if (this.#loading) {
							data.result = result
							applyPaths()
							onLoadHandler()
						}
					})
			}

			if (onStart) onStart(data)
			this.#dispatchEvent('start', data)
			if (!fetchInit) applyPaths()
		}

		if (this.assets.length) {
			if (this.queue) load(this.assets[assetsLoaded])
			else each(this.assets, (data) => load(data))
		} else {
			pct = 1
			checkProgress()
		}

		return this
	}

	set = (id, data) => {
		this.#assetsById[id] = data
	}

	get = (id) => {
		return this.#assetsById[id]
	}

	pause = () => {}

	resume = () => {}

	#resetPath = (el) => {
		if (el) {
			const tagName = el.tagName.toLowerCase()

			switch (tagName) {
				case 'object':
					el.data = PNGPlaceHolder
					break
				case 'use':
					setAttributesNS(el, { href: SVGPlaceHolder })
					break
				case 'image':
					el.setAttribute('href', SVGPlaceHolder)
					break
				case 'audio':
				case 'video':
				case 'script':
					el.src = ''
					break
				case 'link':
					el.setAttribute('href', '')
					break
				default:
					el.src = PNGPlaceHolder
			}
		}
	}

	abort = () => {
		this.progress = 0
		this.started = false
		this.#loading = false

		this.#abortController.abort()
		each(this.#loaders, (el) => this.#resetPath(el))

		each(Object.keys(this.#assetsByPath), (key) => {
			each(this.#assetsByPath[key], (data) => {
				const { el } = data
				if (el) this.#resetPath(el)
			})
		})
	}

	destroy = () => {
		this.abort()
		destroyInstance(this)
	}
}

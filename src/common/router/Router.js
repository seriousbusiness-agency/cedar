import Page from '@common/components/Page'
import {
	createElement,
	delayedCall,
	each,
	query,
	queryAll,
	removeAttributes,
	setAttributes
} from '@common/util/function'
import EventEmitter from 'events'
import PageTransition from './PageTransition'

export default class Router extends EventEmitter {
	selectors
	pageTransition
	pagesDic = {}

	#abortController
	#request
	#cache = {}

	lastHref
	currentPage
	currentVirtualHtmlDocument

	constructor() {
		super()
		if (Router.instance) throw new Error("Singleton classes can't be instantiated more than once.")
		Router.instance = this

		this.pageTransition = new PageTransition()
	}

	static getInstance() {
		return Router.instance || new Router()
	}

	/**
	 *
	 * @param {{path:ClassDefinition|{path:{definition: ClassDefinition,cacheDom:Boolean,cacheInstance:Boolean}}}} data
	 */
	static register(data) {
		Router.getInstance().register(data)
	}

	register = (data) => {
		const keys = Object.keys(data)
		each(keys, (key) => {
			let object = data[key]
			object = object.constructor === Function ? { definition: object } : object
			this.pagesDic[key] = object
		})
	}

	start = (selectors) => {
		this.selectors = selectors || ['main']

		document.body.addEventListener('click', (e) => {
			if (e.ctrlKey || e.metaKey) return
			const link = e.target.closest('a[data-router]')

			if (link) {
				const { 'data-router': dataRouter, 'data-router-params': dataRouterParams } = link.attributes
				const stage = {
					router: dataRouter.value,
					params: dataRouterParams ? dataRouterParams.value : null
				}
				e.preventDefault()

				const url = new URL(link.href)
				if (url.hash) {
					const targetElement = document.querySelector(url.hash)
					if (targetElement) {
						this.#scrollToElement(targetElement)
						return
					}
				}

				if (this.#getNormalizedHref(link.href) !== this.lastHref) window.history.pushState(stage, '', `${link.href}`)
			}
		})

		const { pushState } = window.history

		window.history.pushState = (...args) => {
			if (typeof window.history.onpushstate === 'function') {
				window.history.onpushstate(args[0])
			}
			return pushState.apply(window.history, args)
		}
		window.onpopstate = window.history.onpushstate = (stage) => requestAnimationFrame(() => this.loadPage(stage))

		this.lastHref = this.#getNormalizedHref()

		this.#initPage(document.cloneNode(true))
		this.#updateRefs()
	}

	#scrollToElement = (element) => {
		window.requestAnimationFrame(() => {
			window.scroll.scrollTo(element)
		})
	}

	setPageTransition = (pageTransition) => {
		this.pageTransition = pageTransition
	}

	getCurrentPage = () => {
		return this.currentPage
	}

	#getNormalizedHref = (href) => {
		const url = new URL(href || window.location.href)
		let newHref = `${url.origin}${url.pathname}`
		if (!newHref.endsWith('/')) newHref += '/'
		return newHref
	}

	#updateRefs = () => {
		const activeRefs = queryAll('[data-router-active]')
		const refs = queryAll('[data-router]')

		each(activeRefs, (el) => removeAttributes(el, ['data-router-active']))
		each(refs, (el) => {
			const rest = window.location.href.replace(el.href, '')
			if (rest.length < 2) setAttributes(el, { 'data-router-active': 1 })
		})
	}

	loadPage = async (stage) => {
		this.emit('change')

		const href = this.#getNormalizedHref()
		const isCustomRouter = stage.router === 'custom'

		if (href === this.lastHref || isCustomRouter) {
			if (isCustomRouter) this.lastHref = href
			if (document.documentElement.instance) {
				// document.documentElement.instance.lastHeref
				document.documentElement.instance.doUpdate(stage.params)
			}
			return
		}

		this.#updateRefs()

		if (this.currentPage && !this.currentPage.isReady) {
			this.currentPage.cancelPrepare()
			this.currentPage.didCancelPrepare()
		}
		if (this.#abortController) {
			console.log(`aborting ${this.lastHref}`)
			this.#abortController.abort()
		}

		this.lastHref = href

		const currentHtmlDocument = this.#cache[href]

		let completeHideTime = Date.now()

		this.emit('transitionstart')
		this.pageTransition.onHide = () => {
			this.emit('transitionhide')
			requestAnimationFrame(() => {
				if (currentHtmlDocument) {
					console.log('in cache', href)
					this.#updateDom(currentHtmlDocument)
						.then(() => {
							delayedCall(() => {
								this.pageTransition.show(0).onShow = () => this.emit('transitionshow')
							}, 10)
						})
						.catch((e) => {
							console.log(e)
						})
				} else completeHideTime = Date.now()
			})
		}
		if (this.pageTransition.hideDone) this.pageTransition.onHide()
		else this.pageTransition.hide()

		if (currentHtmlDocument) return
		console.log('start loading', href)

		this.emit('startloading')

		this.#abortController = new AbortController()
		this.#request = await fetch(
			new Request(href, {
				method: 'GET',
				signal: this.#abortController.signal,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			})
		)
			.then((response) => {
				return response.text()
			})
			.then((text) => {
				return new DOMParser().parseFromString(text, 'text/html')
			})
			.then((htmlDocument) => {
				this.emit('loadcomplete')

				this.pageTransition.onHide = () => {
					this.emit('transitionhide')
					requestAnimationFrame(() => {
						this.#updateDom(htmlDocument)
							.then(() => {
								const lapsedTime = Date.now() - completeHideTime
								delayedCall(() => {
									this.#scrollToHash()
									this.pageTransition.show(lapsedTime).onShow = () => this.emit('transitionshow')
								}, 10)
							})
							.catch((e) => {
								console.log(e)
							})
					})
				}
				if (this.pageTransition.hideDone) this.pageTransition.onHide()
			})
			.catch((e) => {
				console.log(e)
			})
		this.#abortController = null
	}

	#extractScripts = (htmlDocument) => {
		console.log(htmlDocument)
		const items = htmlDocument.querySelectorAll('script')
		if (!items.length) return
		each(items, (script) => {
			const newScript = createElement('script', { type: 'text/javascript' })

			Array.from(script.attributes).forEach((attr) => {
				newScript.setAttribute(attr.name, attr.value)
			})

			if (script.src) {
				const url = new URL(script.src)
				url.searchParams.set('t', Date.now())
				newScript.src = url.toString()
			} else newScript.textContent = script.textContent

			script.parentNode.replaceChild(newScript, script)
		})
	}

	#scrollToHash = () => {
		const { hash } = window.location
		if (hash) {
			const targetElement = document.querySelector(hash)
			if (targetElement) {
				window.requestAnimationFrame(() => {
					window.scroll.scrollTo(targetElement)
				})
			}
		}
	}

	#updateDom = (htmlDocument) => {
		const { documentElement } = document
		// const domClone = htmlDocument.cloneNode(true)

		const cacheElements = queryAll('[data-router-cache]')
		each(cacheElements, (el) => {
			const { 'data-router-cache': dataRouterCache } = el.attributes
			removeAttributes(el, ['data-router-cache'])
			const virtualEl = query(`[data-router-cache="${dataRouterCache.value}"]`, this.currentVirtualHtmlDocument)
			virtualEl.parentNode.replaceChild(el, virtualEl)
		})

		const { 'data-parent': dataParent, 'data-template': dataTemplate } = htmlDocument.documentElement.attributes

		if (documentElement.instance) {
			documentElement.instance.dispose()
			documentElement.instance = null
		}

		setAttributes(documentElement, {
			'data-parent': dataParent.value,
			'data-template': dataTemplate.value
		})

		each(this.selectors, (selector) => {
			const currentElement = query(selector)
			const virtualElement = query(selector, htmlDocument)

			if (currentElement && virtualElement) {
				currentElement.innerHTML = `${virtualElement.innerHTML}`
				this.#extractScripts(currentElement)
			}
		})

		const instance = this.#initPage(htmlDocument)

		return new Promise((resolve, reject) => {
			const done = () => {
				this.#scrollToHash()
				this.emit('updatedom')
				resolve()
			}

			if (instance.isReady) done()
			else {
				instance.on('ready', done)
				instance.on('cancel_prepare', reject)
				instance.prepare()
			}
		})
	}

	#initPage = (htmlDocument) => {
		const { documentElement } = document

		const { 'data-parent': dataParent, 'data-template': dataTemplate } = documentElement.attributes
		const key = `${dataParent.value ? `${dataParent.value}/` : ''}${dataTemplate.value}`

		const data = this.pagesDic[key] || { definition: Page }

		const { definition } = data

		const ClassDefinition = definition

		const instance = new ClassDefinition(documentElement)
		instance.id = dataTemplate.value
		instance.href = this.lastHref
		instance.init()
		documentElement.instance = instance
		// keep in cache
		const cacheID = this.#getNormalizedHref()
		this.#cache[cacheID] = htmlDocument
		this.currentPage = instance
		this.currentVirtualHtmlDocument = this.#cache[cacheID]

		return instance
	}
}

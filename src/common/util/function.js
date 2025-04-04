export const svgNs = 'http://www.w3.org/2000/svg'

/**
 *
 * @param {String} selector
 * @param {HTMLElement} root
 * @returns
 */
export const query = (selector, root) => {
	const result = (root || document).querySelector(selector)
	return result ? result.instance || result : result
}

export const pxToRem = (px) => {
	return px / parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export const remToPx = (rem) => {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/**
 *
 * @param {String} selector
 * @param {HTMLElement} root
 * @returns
 */
export const queryAll = (selector, root) => {
	let list

	if (selector.constructor === String) list = (root || document).querySelectorAll(selector)
	else {
		list = {}
		each(Object.keys(selector), (key) => {
			const value = selector[key]
			list[key] = Array.isArray(value)
				? queryAll(value.join(','), root)
				: value.constructor === Object
					? queryAll(value, root)
					: query(value, root)
		})
	}
	return list
}

export const queryComponents = (selector, root) => {
	return getInstances(queryAll(selector, root))
}

export const getInstances = (list) => {
	list = list.constructor === Object ? list : [...list]
	each(Object.keys(list), (key) => {
		const value = list[key]
		if (!value) return
		if (
			value.constructor === Object ||
			value instanceof NodeList ||
			value instanceof HTMLCollection ||
			Array.isArray(value)
		)
			list[key] = getInstances(value)
		else list[key] = value.instance || value
	})
	return list
}

export const toArray = (value) => {
	return Array.isArray(value) || value instanceof NodeList || value instanceof HTMLCollection ? value : [value]
}

/**
 *
 * @param {HTMLElement|HTMLElement[]} el
 * @param {Object} props
 */
export const setProps = (el, props) => {
	el = toArray(el)
	each(Object.keys(props), (key) => {
		each(el, (currentEl) => currentEl.style.setProperty(key, props[key]))
	})
}

export const getProp = (el, prop) => {
	return window.getComputedStyle(el || document.body).getPropertyValue(prop)
}

export const setAttributes = (el, props) => {
	el = toArray(el)
	each(Object.keys(props), (key) => {
		each(el, (currentEl) => currentEl.setAttribute(key, props[key]))
	})
}

export const setAttributesNS = (el, props) => {
	el = toArray(el)
	each(Object.keys(props), (key) => {
		each(el, (currentEl) => currentEl.setAttributeNS(svgNs, key, props[key]))
	})
}

export const removeAttributes = (el, props) => {
	el = toArray(el)
	each(props, (key) => {
		each(el, (currentEl) => currentEl.removeAttribute(key))
	})
}

export const addClass = (el, ...classname) => {
	el = toArray(el)
	if (el.length) each(el, (currentEl) => currentEl.classList.add(...classname))
}

export const removeClass = (el, ...classname) => {
	el = toArray(el)
	if (el.length) each(el, (currentEl) => currentEl.classList.remove(...classname))
}

export const hasClass = (el, classname) => {
	return el.classList.contains(classname)
}

export const itemClass = (el, index) => {
	return el.classList.item(index)
}

export const toggleClass = (el, classname, force) => {
	el.classList.toggle(classname, force)
}

/**
 *
 * @param {HTMLElement|HTMLElement[]} el
 * @param {Boolean} deep
 */
export const clearProps = (el, deep) => {
	el = toArray(el)
	each(el, (currentEl) => {
		currentEl.removeAttribute('style')
		if (deep && currentEl.children && currentEl.children.length) clearProps([...currentEl.children], deep)
	})
}

/**
 *
 * @param {HTMLElement} el
 * @returns {DOMRect}
 */
export const getRect = (el) => {
	const rect =
		el === window
			? {
					x: 0,
					y: 0,
					width: window.innerWidth,
					height: document.documentElement.clientHeight
				}
			: el.getBoundingClientRect()
	rect.maxX = rect.x + rect.width
	rect.maxY = rect.y + rect.height
	rect.cX = rect.x + rect.width * 0.5
	rect.cY = rect.y + rect.height * 0.5
	return rect
}

export const getRelativeRect = (el1, el2) => {
	const rect1 = getRect(el1)
	const rect2 = getRect(el2)
	const x = rect2.x - rect1.x
	const y = rect2.y - rect1.y
	return {
		width: rect2.width,
		height: rect2.height,
		x,
		y,
		maxX: rect2.maxX - rect1.x,
		maxY: rect2.maxY - rect1.y,
		cX: x + rect2.width * 0.5,
		cY: y + rect2.height * 0.5
	}
}

/**
 * @private
 * @param {HTMLElement} el
 * @param {String} name
 * @param {HTMLElement} child
 */
export const addDOMProp = (el, name, child) => {
	const filter = ['text', 'title', 'name']
	if (filter.indexOf(name) > -1) name = `_${name}`
	const value = el[name]
	if (value) {
		if (!value.length) el[name] = [value]
		el[name].push(child)
	} else el[name] = child
}

/**
 *
 * @param {HTMLElement} el
 */
export const clearDOM = (el) => {
	const { children } = el
	each(children, (child) => {
		const tagName = child.tagName.toLowerCase()
		const { classList } = child
		const { id } = child
		delete el[tagName]
		delete el[id]
		if (classList.length) {
			const className = classList[0]
			delete el[className]
		}
		if (child.children.length) {
			clearDOM(child)
		}
	})
}

/**
 *
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
export const getDOM = (el) => {
	clearDOM(el)
	const { children } = el
	each(children, (child) => {
		const tagName = child.tagName.toLowerCase()
		const { classList } = child
		const { id } = child
		addDOMProp(el, tagName, child)
		addDOMProp(el, id, child)
		if (classList.length) {
			const className = classList[0]
			addDOMProp(el, className, child)
		}
		if (child.children.length) {
			getDOM(child)
		}
	})
	return el
}

/**
 *
 * @param {EventTarget} el
 * @param {String} events
 * @param {Function} call
 */
export const addEventListeners = (el, events, call, props) => {
	if (!el) return
	el = toArray(el)
	const eventsList = events.split(' ')
	each(el, (currentEl) => {
		each(eventsList, (event) => {
			currentEl.addEventListener(event, call, props)
		})
	})
}

/**
 *
 * @param {EventTarget} el
 * @param {String} events
 * @param {Function} call
 */
export const removeEventListeners = (el, events, call) => {
	if (!el) return
	el = toArray(el)
	const eventsList = events.split(' ')
	each(el, (currentEl) => {
		each(eventsList, (event) => {
			currentEl.removeEventListener(event, call)
		})
	})
}

/**
 *
 * @param {MouseEvent} e
 * @param {Boolean} absolute
 * @returns {{x:Number, y:Number}}
 */
export const getCursorPoint = (e, absolute) => {
	const target = e.currentTarget
	const rect = getRect(target)
	const point = e.changedTouches ? e.changedTouches[0] : e
	return absolute ? { x: point.clientX, y: point.clientY } : { x: point.clientX - rect.x, y: point.clientY - rect.y }
}

/**
 *
 * @param {HTMLElement} el
 * @returns {{x:Number, y:Number}}
 */
export const getCenterPoint = (el) => {
	const bouding = getRect(el)
	return {
		x: bouding.x + bouding.width * 0.5,
		y: bouding.y + bouding.height * 0.5
	}
}

/**
 *
 * @returns {String}
 */
export const randomizeHexColor = () => {
	return `#${Math.round(Math.random() * 0xffffff).toString(16)}`
}

/**
 *
 * @param {HTMLElement} el
 */
export const isVisible = (el) => {
	return el.offsetWidth > 0 && el.offsetHeight > 0
}

/**
 *
 * @param {String} nomeDaTag
 * @param {Object} tagName
 * @returns
 */
export const createElement = (tagName, attributes) => {
	const el = document.createElement(tagName)
	if (attributes) {
		each(Object.keys(attributes), (key) => {
			el.setAttribute(key, attributes[key])
		})
	}
	return el
}

export const createElementNS = (tagName, attributes) => {
	const el = document.createElementNS(svgNs, tagName)
	if (attributes) {
		each(Object.keys(attributes), (key) => {
			el.setAttributeNS(null, key, attributes[key])
		})
	}
	return el
}

/**
 *
 * @param {String} url
 * @returns
 */
export const toSeoUrl = (url) => {
	return url
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, '-')
		.toLowerCase()
		.replace(/&/g, '-and-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-*/, '')
		.replace(/-*$/, '')
}

/**
 *
 * @param {String} value
 */
export const splitValue = (value) => {
	/* let index = value.length
	let unit = ''
	do {
		index--
		const char = value.charAt(index)
		if (!Number.isNaN(char)) break
		else unit = char + unit
	} while (index > 0)

	const obj = { value: parseFloat(value.substring(0, index + 1)), unit } */
	return { value: parseFloat(value), unit: value.replace(/\d+/g, '') }
}

export const wheelNormalize = (e) => {
	const PIXEL_STEP = 10
	const LINE_HEIGHT = 40
	const PAGE_HEIGHT = 800

	let sX = 0
	let sY = 0
	let pX = 0
	let pY = 0

	// Legacy
	if ('detail' in e) {
		sY = e.detail
	}
	if ('wheelDelta' in e) {
		sY = -e.wheelDelta / 120
	}
	if ('wheelDeltaY' in e) {
		sY = -e.wheelDeltaY / 120
	}
	if ('wheelDeltaX' in e) {
		sX = -e.wheelDeltaX / 120
	}

	if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
		sX = sY
		sY = 0
	}

	pX = sX * PIXEL_STEP
	pY = sY * PIXEL_STEP

	if ('deltaY' in e) {
		pY = e.deltaY
	}
	if ('deltaX' in e) {
		pX = e.deltaX
	}

	if ((pX || pY) && e.deltaMode) {
		if (e.deltaMode === 1) {
			pX *= LINE_HEIGHT
			pY *= LINE_HEIGHT
		} else {
			pX *= PAGE_HEIGHT
			pY *= PAGE_HEIGHT
		}
	}

	if (pX && !sX) {
		sX = pX < 1 ? -1 : 1
	}
	if (pY && !sY) {
		sY = pY < 1 ? -1 : 1
	}

	return {
		spinX: sX,
		spinY: sY,
		pixelX: pX,
		pixelY: pY
	}
}

export const getScreenSize = () => {
	return window.screen.width <= 1024 ? 1 : window.screen.width <= 1920 ? 2 : 3
}

export const canUseWebP = () => {
	return new Promise((res) => {
		const webP = new Image()
		webP.src =
			'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
		webP.onload = webP.onerror = () => {
			res(webP.height === 2)
		}
	})
}

export const canUseAvif = () => {
	return new Promise((res) => {
		const avif = new Image()
		avif.src =
			'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
		avif.onload = avif.onerror = () => {
			res(avif.height === 2)
		}
	})
}

export const getFontSize = (el) => {
	return parseFloat(getProp(el || document.documentElement, 'font-size'))
}

export const pixelToRem = (px, fontSize) => {
	return `${px / (fontSize || getFontSize())}rem`
}

export const getExtension = (filename) => {
	const ext = filename.match(/\.([^./?]+)($|\?)/)
	return ext ? ext[1].toLowerCase() : null
}

export const searchInManifest = (fileName, pathArr) => {
	const { manifest } = window
	if (!manifest || !fileName || !pathArr) return fileName

	let obj = manifest
	for (let i = 0; i < pathArr.length; i++) {
		obj = obj[pathArr[i]]
		if (!obj) return fileName
	}
	const hash = obj[fileName]
	if (hash !== undefined) {
		const extension = getExtension(fileName)
		fileName = fileName.replace(`.${extension}`, `${hash ? `.${hash}` : ''}.${extension}`)
	} else fileName = null
	return fileName
}

export const searchInOtherManifest = (fileName, pathArr) => {
	const manifest = window.otherManifest
	if (!manifest || !fileName || !pathArr) return fileName

	let obj = manifest
	for (let i = 0; i < pathArr.length; i++) {
		obj = obj[pathArr[i]]
		if (!obj) return fileName
	}
	const hash = obj[fileName]
	if (hash !== undefined) {
		const extension = getExtension(fileName)
		fileName = fileName.replace(`.${extension}`, `${hash ? `.${hash}` : ''}.${extension}`)
	} else fileName = null
	return fileName
}
export const debounce = (func, timeout = 100) => {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}

export const getFullSize = () => {
	let ref = query('#height-ref')
	if (!ref) {
		ref = createElement('div', { id: 'height-ref' })
		setProps(ref, {
			position: 'fixed',
			width: '100vw',
			height: '100vh',
			'z-index': -1
		})
	}
	document.body.appendChild(ref)
	const width = ref.clientWidth
	const height = ref.clientHeight
	ref.remove()
	return { width, height }
}

export const destroyInstance = (instance) => {
	const signs = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
	each(Object.keys(instance), (key) => {
		instance[key] = null
		delete instance[key]
	})
	signs.forEach((sign) => {
		instance[sign] = null
		delete instance[sign]
	})
}

export const validateInput = (el, rules) => {
	const value = el.value ? el.value.trim() : ''
	const { length } = value
	let { type, minLength, maxLength } = el.attributes
	const { name, required, 'data-form-label': label } = el.attributes
	const tagName = el.tagName.toLowerCase()
	type = type ? type.value.toLowerCase() : type
	minLength = minLength ? minLength.value : 2
	maxLength = maxLength ? maxLength.value : tagName === 'textarea' ? 1000 : 140

	if (!required) return { valid: true }

	let valid = true
	const buildMessage = (currentLabel) =>
		rules && rules.defaultMessage
			? rules.defaultMessage.replace('%s', rules.translations ? rules.translations[currentLabel] : currentLabel)
			: `Please enter a valid ${currentLabel}.`
	const radioGroup = document.querySelectorAll(`input[name="${name.value}"]`)

	switch (type) {
		case 'tel':
			valid = !(length < 10)
			break
		case 'email':
			{
				const re =
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				valid = re.test(value.toLowerCase())
			}
			break
		case 'radio':
			// Find all radio buttons with the same name
			valid = Array.from(radioGroup).some((radio) => radio.checked)
			break
		case 'checkbox':
			// Find all radio buttons with the same name
			valid = Array.from(radioGroup).some((radio) => radio.checked)
			break
		case 'text':
		case 'hidden':
			valid = value.length !== 0
			break
		default:
	}

	if (valid) valid = !(length < minLength || length > maxLength)
	return { valid, message: valid ? '' : buildMessage(label ? label.value : name.value), input: el }
}

export const validateForm = (form, rules) => {
	const inputs = queryAll('input, textarea')
	const result = {
		valid: true,
		inputs: []
	}

	each(inputs, (input) => {
		const inputResult = validateInput(input, rules)
		if (!inputResult.valid) {
			result.valid = false
			result.inputs.push(inputResult)
		}
	})

	return result
}

export const removeChildren = (parentEl) => {
	;[...parentEl.children].forEach((el) => el.remove())
}

export const appendChildren = (parentEl, children) => {
	;[...children].forEach((el) => parentEl.appendChild(el))
}

export const each = (list, func) => {
	;[...list].forEach(func)
}

export const getScale = (el) => {
	const rect = getRect(el)
	return {
		scaleX: rect.width / el.offsetWidth,
		scaleY: rect.height / el.offsetHeight
	}
}

/**
 *
 * @returns {Boolean}
 */
export const isMobileDevice = () => {
	const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]

	return toMatch.some((toMatchItem) => {
		return navigator.userAgent.match(toMatchItem)
	})
}

// export const isMobile = () => {
// 	return window.innerWidth <= breakpoints.mobile.max
// }

export const isBreakpoint = (data) => {
	const { min, max } = data.constructor === String ? breakpoints[data] : data

	const width = Math.ceil(window.innerWidth)
	const minCondition = Number.isFinite(min) ? width >= min : true
	const maxCondition = Number.isFinite(max) ? width <= max : true
	const condition = minCondition && maxCondition

	return condition
}

export const isIOS = () => {
	return navigator.userAgent.match(/iPhone|iPod|iPad/)
}

export const isSafari = () => {
	return navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/)
}

/**
 *
 * @param {{min:Number, max:Number}|String} data
 * @param {Function} callback
 * @returns {{revert:Function}}
 */
export const breakpoint = (data, callback) => {
	// const { min, max } = data.constructor === String ? breakpoints[data] : data

	let active = false
	let reset

	const resize = (e) => {
		// const width = Math.ceil(window.innerWidth)
		// const minCondition = Number.isFinite(min) ? width >= min : true
		// const maxCondition = Number.isFinite(max) ? width <= max : true
		// const condition = minCondition && maxCondition
		const condition = isBreakpoint(data)

		if (!active && condition) {
			reset = callback(e)
			active = true
		} else if (active && !condition) {
			if (reset) {
				reset()
				reset = null
			}
			active = false
		}
	}
	const debounceResize = debounce(resize, 200)

	window.addEventListener('resize', debounceResize)
	resize()

	return {
		revert: (ignoreReset) => {
			if (!ignoreReset && reset) reset()
			reset = null
			window.removeEventListener('resize', debounceResize)
		}
	}
}

export const breakpoints = {
	mobile: {
		max: 599
	},
	tablet: {
		min: 768,
		max: 1024
	},
	desktop: {
		min: 768
	},
	'max-tablet': {
		max: 1024
	},
	'min-tablet': {
		min: 600
	}
}

export const capitalize = (value) => {
	return value.charAt(0).toUpperCase() + value.slice(1)
}

export const fixResizeObserver = (timeout = 16) => {
	const OriginalResizerObserver = window.ResizeObserver
	window.ResizeObserver = class ResizeObserver extends OriginalResizerObserver {
		constructor(callback) {
			super(debounce(callback, timeout))
		}
	}
}

export const delayedCall = (call, delayTime) => {
	let hideStartTime
	const updateTime = () => {
		if (document.visibilityState === 'visible') {
			const lapsedTime = Date.now() - hideStartTime
			delayTime += lapsedTime
		} else hideStartTime = Date.now()
	}

	document.addEventListener('visibilitychange', updateTime)

	let request
	const startTime = Date.now()
	const innerCall = (...args) => {
		window.cancelAnimationFrame(request)
		document.removeEventListener('visibilitychange', updateTime)
		call(...args)
	}
	const checkTime = () => {
		const currentTime = Date.now()
		if (currentTime - startTime >= delayTime) innerCall()
		else request = window.requestAnimationFrame(checkTime)
	}

	checkTime()

	return {
		call: innerCall,
		cancel: () => {
			window.cancelAnimationFrame(request)
			document.removeEventListener('visibilitychange', updateTime)
		}
	}
}

export const splitString = (text, type = 1) => {
	let result = ''

	const formatWord = (wordResult, isSeparator) => {
		return `<span class="part-container${isSeparator ? ' separator' : ''}"><span class="word">${wordResult}</span></span>`
	}
	/* const separators = ['-', '‑']
	const needsSubSplit = (word) => separators.some((value) => word.includes(value))
	const createSubwords = (word) => {
		const index = separators.findIndex((value) => word.includes(value))
		const separator = separators[index]
		const subWords = word.split(separator)
		let subResult = ''
		each(subWords, (subWord, j) => {
			subResult += needsSubSplit(subWord) ? createSubwords(subWord) : formatWord(subWord)
			if (j < subWords.length - 1) subResult += formatWord(separator, true)
		})
		return subResult
	} */

	const words = text.split(' ')
	const count = words.length
	each(words, (word, i) => {
		let wordResult = word
		if (type === 2) {
			wordResult = ''
			const chars = Array.from(word)
			each(chars, (char) => {
				wordResult += `<span class="char"><span>${char}</span></span>`
			})
		} /* else if (needsSubSplit(word)) {
			result += `${createSubwords(word)}${i < count - 1 ? ' ' : ''}`
			return
		} */
		if (!wordResult) return
		result += `${formatWord(wordResult)}${i < count - 1 ? ' ' : ''}`
	})

	return result
}

export const splitNodesText = (element, type = 1) => {
	const nodes = element.childNodes
	let result = ''

	each(nodes, (node) => {
		if (node.constructor !== HTMLBRElement) {
			if (node.constructor === Text) {
				if (node.nodeValue.trim()) {
					const firstChar = node.nodeValue.charAt(0)
					result += `${firstChar === ' ' ? firstChar : ''}${splitString(node.nodeValue, type)}`
				}
			} else if (node.innerHTML.trim() || node.children.length)
				result += `${node.outerHTML.replace(node.innerHTML, splitNodesText(node, type))}`
		} else result += '<br>'
	})

	return result
}

export const splitText = (element, fixHyphens, type = 1) => {
	if (element.split) return element.split

	const isItalic = getProp(element, 'font-style') === 'italic'
	let originalValue = element.innerHTML
	if (!query('.parts-root', element)) {
		element.innerHTML = `<span class="parts-root">${splitNodesText(element, type)}</span>`
	}

	const result = {
		originalValue,
		revert: () => {
			element.innerHTML = originalValue

			if (fixHyphens) {
				const originalText = element.innerText
				const separators = ['-', '‑']
				const needsFix = (str) => separators.some((value) => str.includes(value))
				if (needsFix(originalText)) {
					const words = originalText.split(' ').filter((value) => needsFix(value))
					let newValue = ''
					each(words, (word) => {
						if (word.length > 1)
							newValue = (newValue || originalValue).replaceAll(
								word,
								`<span style="white-space: nowrap">${word}</span>`
							)
					})
					if (newValue) element.innerHTML = newValue
				}
			}

			element.split = null
			result.originalValue = result.revert = result.getLines = originalValue = null
		},
		getRoot: () => query('.parts-root', element),
		getContainers: () => queryAll('.part-container', result.getRoot()),
		getWords: () => queryAll('.word', result.getRoot()),
		getParts: () => queryAll(type === 2 ? '.char' : '.word', result.getRoot()),
		getLines: (byChildren) => {
			const parts = byChildren ? result.getRoot().childNodes : result.getParts()
			const lines = []

			let lastY
			let lineParts

			each(parts, (part) => {
				const rect = getRect(part)
				if (lastY !== rect.y) {
					lastY = rect.y
					lineParts = []
					lines.push(lineParts)
				}
				lineParts.push(part)
			})

			return lines
		},
		splitLines: () => {
			const root = result.getRoot()
			const lines = result.getLines()
			const splitedLines = []

			const elementDisplay = getProp(element, 'display')
			setProps(root, {
				display:
					!elementDisplay || elementDisplay === 'inline'
						? 'inline-block'
						: elementDisplay === 'flex'
							? ''
							: elementDisplay
			})

			const getRootOfPartContainer = (elementRoot) => {
				const partsRoot = elementRoot.parentNode
				return hasClass(partsRoot, 'parts-root') ? elementRoot : getRootOfPartContainer(partsRoot)
			}

			each(lines, (words) => {
				const spanLine = createElement('span', { class: 'line' })
				const linePartContainer = createElement('span', { class: 'part-container' })
				setProps([spanLine, linePartContainer], { display: 'block' })

				splitedLines.push(spanLine)

				each(words, (word, i) => {
					const currentPartContainer = word.parentNode
					const rootOfPart = getRootOfPartContainer(currentPartContainer)

					if (rootOfPart === linePartContainer) return

					if (!spanLine.parentNode) {
						root.insertBefore(linePartContainer, rootOfPart)
						linePartContainer.appendChild(spanLine)
					}

					const nextNode = rootOfPart.nextSibling
					const isSamePartContainer = currentPartContainer === rootOfPart

					spanLine.appendChild(isSamePartContainer ? word : rootOfPart)

					if (nextNode) {
						if (i < words.length - 1 && nextNode.constructor === Text) spanLine.appendChild(nextNode)
						else if (nextNode.constructor === HTMLBRElement) nextNode.remove()
					}
					if (isSamePartContainer && currentPartContainer) currentPartContainer.remove()
				})
			})

			return splitedLines
		}
	}

	if (type === 2) {
		const fontSize = getFontSize(element)
		each(result.getParts(), (part) => {
			const rect = getRect(part)
			const emWidth = rect.width / fontSize
			// const emHeight = rect.height / fontSize
			setProps(part, { display: 'inline-flex', width: `${emWidth}em` /* , height: `${emHeight}em` */ })
		})
	} else {
		each(result.getParts(), (part) => {
			setProps(part, { display: 'inline-flex' })
		})
	}

	if (isItalic) {
		each(result.getContainers(), (container) =>
			setProps(container, { 'padding-inline': '.15em', 'margin-inline': '-.15em' })
		)
	}

	element.split = result

	return result
}

export const getDataAnimParams = (element) => {
	const {
		'data-anim': data,
		'data-anim-duration': duration,
		'data-anim-delay': delay,
		'data-anim-stagger': stagger,
		'data-anim-params': animParams,
		'data-anim-leave-reset': leaveReset,
		'data-anim-leave-back-reset': leaveBackReset
	} = element.attributes

	return {
		value: data,
		duration: duration ? parseFloat(duration.value) : null,
		delay: delay ? parseFloat(delay.value) : null,
		stagger: stagger ? parseFloat(stagger.value) : null,
		animParams: animParams ? JSON.parse(animParams.value) : null,
		leaveReset,
		leaveBackReset
	}
}

export const hover = (element, overHandler, outHandler, touchEvents) => {
	addEventListeners(element, `mouseenter${touchEvents ? ' touchstart' : ''}`, overHandler)
	addEventListeners(element, `mouseleave${touchEvents ? ' touchend' : ''}`, outHandler)

	return {
		dispose: () => {
			removeEventListeners(element, `mouseenter${touchEvents ? ' touchstart' : ''}`, overHandler)
			removeEventListeners(element, `mouseleave${touchEvents ? ' touchend' : ''}`, outHandler)
		}
	}
}

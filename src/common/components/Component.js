import { Observer } from '@common/observer'
import { debounce, each, query, queryComponents } from '@common/util/function'
import EventEmitter from 'events'

Observer.create(0, { root: null, rootMargin: '0px', threshold: 0 })

export default class Component extends EventEmitter {
	element
	// resizerObserver
	isInView
	initialized
	started
	elements = {}

	debounceResize

	constructor(element) {
		super()

		this.element = element.constructor === String ? query(element) : element
	}

	init = () => {
		if (!this.initialized) {
			this.initialized = true

			Observer.observe(0, this.element, this.#observerHandler)

			this.debounceResize = debounce(this.resize)
			// this.resizerObserver = new window.ResizeObserver(this.debounceResize)
			// this.resizerObserver.observe(this.element)
			window.addEventListener('resize', this.debounceResize)
		}
	}

	#observerHandler = (_, entry /* , observer */) => {
		this.isInView = entry.isIntersecting
		if (this.isInView) {
			this.startComponent()
			this.didInView()
			this.#dispatchEvent('inView')
		} else if (this.started) this.#outView()
	}

	#outView = () => {
		this.didOutView()
		this.#dispatchEvent('outView')
	}

	startComponent = () => {
		if (!this.started) {
			this.init()
			this.started = true
			this.doStart()
			this.#dispatchEvent('start')
			this.didResize()
		}
	}

	resize = () => {
		if (this.started && this.isInView && this.element.parentNode) {
			// window.requestAnimationFrame(() => {
			// 	if (!Array.isArray(entries) || !entries.length) return
			// 	this.didResize()
			// 	this.#dispatchEvent('resize')
			// })
			this.didResize()
			this.#dispatchEvent('resize')
		} else if (this.started && this.element.parentNode) {
			this.didResize()
		}
	}

	#dispatchEvent = (type) => {
		this.emit(type, this.element)
	}

	queryChildren = (selectors) => {
		this.elements = { ...this.elements, ...queryComponents(selectors, this.element) }
	}

	didInView = () => {}

	didOutView = () => {}

	didResize = () => {}

	doSetup = () => {}

	doStart = () => {}

	didDispose = () => {}

	dispose = (recursive) => {
		console.log('disposing', this)
		if (this.isInView && this.element && this.element.parentNode) {
			this.#outView()
		}
		// console.log('Component:dispose()', this)
		// this.resizerObserver.unobserve(this.element)
		// this.resizerObserver.disconnect()

		// dispose children
		if (recursive && this.elementt) {
			each(queryComponents('[data-component]', this.element), (childComponent) => {
				if (childComponent && childComponent.element) childComponent.dispose()
			})
		}

		window.removeEventListener('resize', this.debounceResize)
		Observer.unobserve(0, this.element, this.#observerHandler)
		this.didDispose()
		this.#dispatchEvent('dispose')

		each(Object.keys(this), (key) => {
			this[key] = null
			delete this[key]
		})
	}
}

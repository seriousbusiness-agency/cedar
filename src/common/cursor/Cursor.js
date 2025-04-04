import { Component } from '@common/components'
import {
	addClass,
	addEventListeners,
	each,
	getCursorPoint,
	hasClass,
	isMobileDevice,
	query,
	queryAll,
	removeClass,
	removeEventListeners
} from '@common/util/function'
import CursorTracker from './CursorTracker'

export default class Cursor extends Component {
	tracker
	cursors

	constructor(element, domRef, props = { inertia: 0.075, friction: 0 }) {
		element = element || query('#cursor', document)
		super(element)
		if (!this.element) throw new Error("Cursor element doesn't exist")
		this.tracker = new CursorTracker(this.element.children[0], domRef, props)
		this.tracker.pause()
	}

	setPosition = (point, immediate) => {
		this.tracker.set([point.x, point.y], immediate)
		each(this.tracker.trackers, (childTracker) => childTracker.set([point.x, point.y], immediate))
	}

	clean = () => {
		if (!this.cursors) return
		// each(this.cursors, (el) => removeEventListeners(el, 'mouseenter mouseleave', this.#updateCursor))
		removeEventListeners(this.cursors, 'mouseenter mouseleave', this.#updateCursor)
	}

	#updateCursor = (e) => {
		if (isMobileDevice() || this.tracker.paused) return
		const target = e.currentTarget
		const className = target.getAttribute('data-cursor')
		switch (e.type) {
			case 'mouseenter':
				addClass(this.element, className)
				this.didAddClass(className, target)
				break
			case 'mouseleave':
				removeClass(this.element, className)
				this.didRemoveClass(className, target)
				break
			default:
		}
	}

	#show = (e) => {
		this.show()
		const point = getCursorPoint(e)
		this.tracker.set([point.x, point.y], true)
		each(this.tracker.trackers, (childTracker) => childTracker.set([point.x, point.y], true))
	}

	show = () => {
		addClass(this.element, 'show')
	}

	hide = () => {
		removeClass(this.element, 'show')
	}

	isVisible = () => {
		return hasClass(this.element, 'show')
	}

	start = () => {
		this.resume()
	}

	resume = () => {
		if (isMobileDevice()) return
		window.addEventListener('mousemove', this.#show, { once: true })
		this.tracker.start()
	}

	pause = () => {
		removeClass(this.element, 'show')
		window.removeEventListener('mousemove', this.#show)
		this.tracker.pause()
	}

	scan = () => {
		// if (isMobileDevice()) return
		this.clean()
		this.cursors = queryAll('[data-cursor]')
		// each(this.cursors, (el) => addEventListeners(el, 'mouseenter mouseleave', this.#updateCursor))
		addEventListeners(this.cursors, 'mouseenter mouseleave', this.#updateCursor)
	}

	didAddClass = () => {}

	didRemoveClass = () => {}

	destroy = () => {}
}

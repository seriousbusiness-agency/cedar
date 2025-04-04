import Interpolator from '@common/animation/Interpolator'
import { addEventListeners, each, getCursorPoint, getRect, removeEventListeners, setProps } from '@common/util/function'

export default class CursorTracker extends Interpolator {
	el
	domRef
	trackers = []
	tracking = false

	constructor(el, domRef, props = { inertia: 0.05, friction: 0, precision: 0.001 }) {
		super([0, 0], props)
		this.el = el
		this.domRef = domRef || window

		if (el)
			setProps(el, {
				transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, var(--x, 0), var(--y, 0), 0, 1)'
			})
		this.on('update', this.updateHandler)
	}

	updateHandler = () => {
		if (!this.value) return

		const x = this.value[0]
		const y = this.value[1]

		if (this.el) setProps(this.el, { '--x': x, '--y': y })

		each(this.trackers, (tracker) => {
			tracker.set([x, y])
		})
	}

	mouseMoveHandler = (e) => {
		if (this.tracking) return
		const point = getCursorPoint(e, true)
		const domRefRect = getRect(this.domRef)
		const rX = point.x - domRefRect.x
		const rY = point.y - domRefRect.y
		this.set([rX, rY])
	}

	onPause = () => {
		each(this.trackers, (tracker) => tracker.pause())
		if (!this.tracking) removeEventListeners(this.domRef, 'mousemove touchstart touchmove', this.mouseMoveHandler)
	}

	onResume = () => {
		each(this.trackers, (tracker) => tracker.resume())
		if (!this.tracking) addEventListeners(this.domRef, 'mousemove touchstart touchmove', this.mouseMoveHandler)
	}

	start = () => {
		this.resume()
	}

	track = (cursorTracker) => {
		cursorTracker.tracking = true
		this.trackers.push(cursorTracker)
	}
}

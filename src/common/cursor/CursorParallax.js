import Interpolator from '@common/animation/Interpolator'
import { addEventListeners, getCursorPoint, getRect, removeEventListeners } from '@common/util/function'

export default class CursorParallax extends Interpolator {
	domRef
	originPoint

	constructor(domRef, originPoint = { x: 0.5, y: 0.5 }, props = { inertia: 0.05, friction: 0, precision: 0.01 }) {
		super([0, 0], props)
		this.domRef = domRef || window
		this.originPoint = originPoint
	}

	mouseMoveHandler = (e) => {
		const point = getCursorPoint(e, true)
		const domRefRect = getRect(this.domRef)

		const rOriginX = domRefRect.width * this.originPoint.x
		const rOriginY = domRefRect.height * this.originPoint.y
		const rX = point.x - domRefRect.x - rOriginX
		const rY = point.y - domRefRect.y - rOriginY
		let pctX = rX < rOriginX ? rX / rOriginX : rX / (domRefRect.width - rOriginX)
		let pctY = rY < rOriginY ? rY / rOriginY : rY / (domRefRect.height - rOriginY)
		pctX = Math.max(Math.min(pctX, 1), -1)
		pctY = Math.max(Math.min(pctY, 1), -1)

		this.set([pctX, pctY])
	}

	onPause = () => {
		removeEventListeners(window, 'mousemove touchstart touchmove', this.mouseMoveHandler)
	}

	onResume = () => {
		addEventListeners(window, 'mousemove touchstart touchmove', this.mouseMoveHandler)
	}

	start = () => {
		this.resume()
	}
}

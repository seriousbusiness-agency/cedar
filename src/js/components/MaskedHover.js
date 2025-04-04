import { addClass } from '@common/util/function'
import { Component } from '@common/components'

export default class MaskHover extends Component {
	doStart = () => {
		this.element.addEventListener('mouseenter', this.enterHandler)
		this.inertia = 0.1
	}

	enterHandler = (event) => {
		if (window.innerWidth < 1025) return
		if (!this.svgElement) {
			this.circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
			this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			addClass(this.svgElement, 'mask-ball')
			this.svgElement.appendChild(this.circleElement)
			this.element.appendChild(this.svgElement)

			requestAnimationFrame(() => {
				addClass(this.element, 'hoverfix')
			})
		}
		this.element.addEventListener('mousemove', this.moveHandler)
		this.element.addEventListener('mouseleave', this.leaveHandler, { once: true })

		const radius = Math.ceil(Math.hypot(this.element.clientWidth, this.element.clientHeight))
		this.element.style.setProperty('--radius', `${radius}px`)
		this.circleElement.removeEventListener('transitionend', this.reset)

		this.moveHandler(event)
		if (!this.isRunning) {
			this.isRunning = true
			this.renderBall()
		}
	}

	leaveHandler = () => {
		this.element.style.setProperty('--radius', '0px')
		this.element.removeEventListener('mousemove', this.moveHandler)
		this.circleElement.addEventListener('transitionend', this.reset)
	}

	reset = () => {
		this.cursorPoint = null
		this.lerpCursorPoint = null
		this.isRunning = false
	}

	moveHandler = (event) => {
		const rect = this.element.getBoundingClientRect()
		const centerX = rect.left
		const centerY = rect.top
		const relX = event.clientX - centerX
		const relY = event.clientY - centerY
		this.cursorPoint = { x: relX, y: relY }
		if (!this.lerpCursorPoint) this.lerpCursorPoint = this.cursorPoint
	}

	renderBall = () => {
		if (this.isRunning) {
			this.lerpCursorPoint.x += (this.cursorPoint.x - this.lerpCursorPoint.x) * this.inertia
			this.lerpCursorPoint.y += (this.cursorPoint.y - this.lerpCursorPoint.y) * this.inertia
			this.element.style.setProperty('--x', `${this.lerpCursorPoint.x}px`)
			this.element.style.setProperty('--y', `${this.lerpCursorPoint.y}px`)
			window.requestAnimationFrame(this.renderBall)
		}
	}
}

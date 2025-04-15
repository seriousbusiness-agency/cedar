import { Component } from '@common/components'
import { queryAll, removeClass } from '@common/util/function'
import gsap from 'gsap'

export default class Transition extends Component {
	hiding
	showing

	onHide
	onShow
	tl

	hideDone

	constructor() {
		super('.page-transition')

		this.elements = queryAll({})
	}

	hide = () => {
		if (this.hiding) return this

		this.hideDone = false
		this.hiding = true

		if (!this.element.parentNode) {
			document.body.appendChild(this.element)
		}

		gsap.to(this.element, {
			autoAlpha: 1,
			duration: 0.45,
			ease: 'Quart.easeOut',
			onStart: () => {
				removeClass(this.element, 'hide')
			},
			onComplete: () => {
				this.showing = false
				this.hideDone = true
				if (this.onHide) this.onHide()
			}
		})

		setTimeout(() => {}, 550)

		return this
	}

	show = () => {
		if (this.showing) return this

		this.hideDone = false
		this.hiding = false
		this.showing = true

		gsap.to(this.element, {
			autoAlpha: 0,
			duration: 0.3,
			ease: 'Quart.easeOut',
			'pointer-events': 'none',
			onStart: () => {
				if (!this.element.parentNode) document.body.appendChild(this.element)
			},
			onComplete: () => {
				this.isAnimating = false
				this.isOpen = true
			}
		})

		return this
	}
}

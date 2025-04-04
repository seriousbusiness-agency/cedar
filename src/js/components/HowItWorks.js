import { Component } from '@common/components'
import Swiper from 'swiper'
import { FreeMode } from 'swiper/modules'
import { getRect, addClass, removeClass } from '@common/util/function'
import { Cursor } from '@common/cursor'

export default class HowItWorks extends Component {
	doStart = () => {
		this.queryChildren({
			slider: '.how-it-works__slider',
			cursor: '.how-it-works__slider .wrapper',
			links: ['.how-it-works__slide__link-wrapper']
		})

		if (window.innerWidth < 768) return
		this.swiper = new Swiper(this.elements.slider, {
			spaceBetween: 12,
			modules: [FreeMode],
			freeMode: true,
			touchStartPreventDefault: false,
			grabCursor: true
		})

		this.#handleCursor()
	}

	#handleCursor = () => {
		this.cursor = new Cursor(this.elements.cursor, this.elements.slider, { inertia: 0.15 })

		this.cursor.scan()
		this.cursor.start()

		window.requestAnimationFrame(() => {
			const x = getRect(this.elements.cursor).width * 0.5
			const y = getRect(this.elements.cursor).height * 0.5

			this.cursor.tracker.set([x, y])
		})

		this.cursor.didAddClass = () => {
			addClass(this.elements.slider, 'active')
		}

		this.cursor.didRemoveClass = () => {
			removeClass(this.elements.slider, 'active')
		}

		this.elements.links.forEach((link) => {
			link.addEventListener('mouseenter', this.cursor.didRemoveClass)
			link.addEventListener('mouseleave', this.cursor.didAddClass)
		})
	}
}

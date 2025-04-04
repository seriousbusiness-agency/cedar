import { Component } from '@common/components'
import Swiper from 'swiper'
import { FreeMode, Navigation } from 'swiper/modules'
import { getRect, addClass, removeClass } from '@common/util/function'
import { Cursor } from '@common/cursor'

export default class Partners extends Component {
	doStart = () => {
		this.queryChildren({
			slider: '.partners__items',
			slides: ['.swiper-slide'],
			cursor: '.partners__items .wrapper',
			prevEl: '.partners__items__button--prev',
			nextEl: '.partners__items__button--next'
		})

		this.swiper = new Swiper(this.elements.slider, {
			spaceBetween: window.innerWidth >= 768 ? 20 : 14,
			modules: [FreeMode, Navigation],
			freeMode: true,
			// touchStartPreventDefault: false,
			slidesPerView: window.innerWidth >= 768 ? 3 : 1,
			navigation: {
				prevEl: this.elements.prevEl,
				nextEl: this.elements.nextEl
			}
		})

		// if (this.elements.slides.length > 3) this.#handleCursor()
	}

	#handleCursor = () => {
		if (window.innerWidth < 1024) return
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
	}

	didResize = () => {
		if (!this.swiper) return

		if (window.innerWidth >= 768) {
			console.log(22, window.innerWidth)
			this.swiper.params.slidesPerView = 3
			this.swiper.params.spaceBetween = 20
		} else {
			this.swiper.params.slidesPerView = 1
			this.swiper.params.spaceBetween = 14
		}
	}
}

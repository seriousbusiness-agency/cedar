import { Component } from '@common/components'
import Swiper from 'swiper'
import { FreeMode } from 'swiper/modules'
import { getRect, addClass, removeClass } from '@common/util/function'
import { Cursor } from '@common/cursor'

export default class Values extends Component {
	doStart = () => {
		this.queryChildren({
			slider: '.values__items',
			slides: ['.swiper-slide'],
			cursor: '.values__items .wrapper',
			paragraphs: ['.values__item__paragraph']
		})

		this.swiper = new Swiper(this.elements.slider, {
			spaceBetween: window.innerWidth >= 768 ? 20 : 14,
			modules: [FreeMode],
			freeMode: true,
			touchStartPreventDefault: false,
			slidesPerView: window.innerWidth >= 768 ? (this.elements.slides.length < 4 ? 3 : 2) : 1,
			slidesPerGroup: window.innerWidth >= 768 ? (this.elements.slides.length < 4 ? 3 : 1) : 1
		})

		// if (this.elements.slides.length > 3) this.#handleCursor()
	}

	#fixHeights = () => {
		this.elements.paragraphs.forEach((paragraph) => {
			// set each paragraph's height equal to the tallest one in the group
			const height = Math.max(...this.elements.paragraphs.map((el) => getRect(el).height))
			paragraph.style.height = `${height}px`
		})
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
		if (this.swiper) {
			this.swiper.params.spaceBetween = window.innerWidth >= 768 ? 20 : 14
			this.swiper.params.slidesPerView = window.innerWidth >= 768 ? (this.elements.slides.length < 4 ? 3 : 2) : 1
			this.swiper.params.slidesPerGroup = window.innerWidth >= 768 ? (this.elements.slides.length < 4 ? 3 : 1) : 1
			this.swiper.update() // Add this line to force Swiper to update
		}

		this.elements.paragraphs.forEach((paragraph) => {
			paragraph.style.height = ''
		})
		this.#fixHeights()
	}
}

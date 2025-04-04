import { Component } from '@common/components'
import { addClass, removeClass } from '@common/util/function'
import Swiper from 'swiper'
import { FreeMode, Navigation } from 'swiper/modules'

export default class Gallery extends Component {
	doStart = () => {
		this.queryChildren({
			slider: '.gallery__cards-wrapper',
			swiperWrapper: '.gallery__cards',
			prevButton: '.gallery__cards__button--prev',
			nextButton: '.gallery__cards__button--next'
		})
	}

	didResize = () => {
		if (window.innerWidth < 768) {
			if (this.swiper) return

			addClass(this.elements.swiperWrapper, 'swiper-wrapper')

			this.swiper = new Swiper(this.elements.slider, {
				spaceBetween: 12,
				modules: [FreeMode, Navigation],
				freeMode: true,
				navigation: {
					prevEl: this.elements.prevButton,
					nextEl: this.elements.nextButton
				}
			})
		} else {
			if (!this.swiper) return

			removeClass(this.elements.swiperWrapper, 'swiper-wrapper')
			this.swiper.destroy()
			this.swiper = null
		}
	}
}

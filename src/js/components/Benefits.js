import { Component } from '@common/components'
import { addClass, removeClass } from '@common/util/function'
import Swiper from 'swiper'
import { FreeMode, Navigation } from 'swiper/modules'

export default class Benefits extends Component {
	doStart = () => {
		this.queryChildren({
			slider: '.benefits__cards-wrapper',
			swiperWrapper: '.benefits__cards',
			prevButton: '.benefits__cards__button--prev',
			nextButton: '.benefits__cards__button--next'
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

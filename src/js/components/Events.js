import { Component } from '@common/components'
import Swiper from 'swiper'
import { FreeMode, Navigation } from 'swiper/modules'

export default class Events extends Component {
	doStart = () => {
		this.queryChildren({
			slider: '.events__items',
			prevButton: '.events__button--prev',
			nextButton: '.events__button--next'
		})

		this.swiper = new Swiper(this.elements.slider, {
			spaceBetween: 12,
			modules: [FreeMode, Navigation],
			freeMode: true,
			navigation: {
				prevEl: this.elements.prevButton,
				nextEl: this.elements.nextButton
			}
		})
	}
}

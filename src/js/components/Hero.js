import { Component } from '@common/components'
import { setProps, searchInOtherManifest, hasClass } from '@common/util/function'
import lottie from 'lottie-web'

export default class Hero extends Component {
	doStart = () => {
		this.queryChildren({
			arrow: '.hero__see-more',
			image: '.hero__image'
		})

		if (hasClass(this.element, 'lottie')) this.#setupLotties()

		this.nextSection = this.element.nextElementSibling

		if (!this.elements.arrow) return

		if (!this.nextSection) setProps(this.elements.arrow, { visibility: 'hidden' })

		this.elements.arrow.addEventListener('click', this.#handleArrow)
	}

	#handleArrow = () => {
		window.main.scroller.scrollTo(this.nextSection)
	}

	#setupLotties = () => {
		this.lottie = lottie.loadAnimation({
			container: this.elements.image,
			renderer: 'canvas',
			loop: true,
			autoplay: true,
			path: `${window.baseURL}/json/${searchInOtherManifest(`hero-lottie.json`, ['json'])}`,
			// path: window.mainLoader.get(`hero-lottie`),
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid meet'
				// preserveAspectRatio: 'xMidYMid slice'
				// preserveAspectRatio: 'contain'
			}
		})

		// Set initial size
		this.#resizeLottie()

		// Add resize listener
		window.addEventListener('resize', this.#resizeLottie)
		this.elements.image.addEventListener('resize', this.#resizeLottie)
	}

	#resizeLottie = () => {
		if (!this.lottie || !this.elements.image) return

		// Force the canvas to match parent dimensions
		const canvas = this.elements.image.querySelector('canvas')
		if (canvas) {
			const parentWidth = this.elements.image.clientWidth
			const parentHeight = this.elements.image.clientHeight

			canvas.style.width = parentWidth
			canvas.style.height = parentHeight

			// Update lottie animation dimensions
			this.lottie.resize()
		}
	}

	didDispose = () => {
		if (this.elements.arrow) this.elements.arrow.removeEventListener('click', this.#handleArrow)

		// Clean up resize listener
		window.removeEventListener('resize', this.#resizeLottie)

		// Destroy lottie instance
		if (this.lottie) {
			this.lottie.destroy()
			this.lottie = null
		}
	}
}

import { Component } from '@common/components'
import { hasClass, searchInOtherManifest } from '@common/util/function'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import lottie from 'lottie-web'

gsap.registerPlugin(ScrollTrigger)

export default class HeroVariant extends Component {
	doStart = () => {
		this.queryChildren({
			images: ['.hero-variant__image'],
			imagesWrapper: '.hero-variant__images-wrapper',
			cards: ['.hero-variant__card']
		})

		if (this.elements.images.length < 2) return

		this.elements.images.forEach((image) => {
			gsap.set(image, { willChange: 'transform', backfaceVisibility: 'hidden' })
		})

		this.elements.cards.forEach((card) => {
			gsap.set(card, { willChange: 'transform', backfaceVisibility: 'hidden' })
		})

		if (hasClass(this.element, 'lottie')) {
			this.#setupLotties()
			return
		}
		this.#setupTimeline()
	}

	#setupTimeline = (hasLottie = false) => {
		this.timeline = gsap.timeline({
			scrollTrigger: {
				trigger: this.elements.imagesWrapper,
				start: 'center center',
				end: `+=${this.elements.images.length * 85}%`,
				pin: true,
				scrub: 1,
				markers: false,
				pinSpacing: true,
				fastScrollEnd: true,
				preventOverlaps: true
			},
			onStart: () => {
				if (this.lotties[0]) this.lotties[0].play()
			}
		})

		if (hasLottie) this.timeline.scrollTrigger.refresh()

		this.elements.images.forEach((image, i) => {
			// adding this to make it not apply for the last item
			if (i !== this.elements.images.length - 1) {
				this.timeline.to(image, {
					// y: '-50%',
					scale: 0.85,
					autoAlpha: 0,
					ease: 'Quart.easeInOut',
					onStart: () => {}
				})

				this.timeline.to(
					this.elements.cards[i],
					{
						scale: 0.85,
						y: window.innerWidth >= 768 ? '-100%' : '0%',
						autoAlpha: 0,
						ease: 'Quart.easeInOut'
					},
					'<'
				)
			}

			const nextElement = this.elements.images[i + 1]
			if (!nextElement) return
			this.timeline.from(
				nextElement,
				{
					y: '125%',
					autoAlpha: window.innerWidth >= 768 ? 1 : 0,
					ease: 'Quart.easeInOut',
					onStart: () => {
						if (this.lotties[i + 1]) this.lotties[i + 1].play()
					},
					onReverseComplete: () => {
						if (this.lotties) {
							if (this.lotties[i + 1]) this.lotties[i + 1].pause()
							this.lotties[i].play()
						}
					}
				},
				'<'
			)

			this.timeline.from(
				this.elements.cards[i + 1],
				{
					autoAlpha: 0,
					y: '+=125%',
					ease: 'Quart.easeInOut'

					// scale: 1
				},
				'<'
			)
		})
	}

	#setupLotties = () => {
		this.lotties = []
		let loadedCount = 0

		this.elements.images.forEach((image, i) => {
			const lampAnim = lottie.loadAnimation({
				container: image,
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path: `${window.baseURL}/json/${searchInOtherManifest(`${i + 1}.json`, ['json'])}`,
				rendererSettings: {
					progressiveLoad: true,
					hideOnTransparent: true
				}
			})

			lampAnim.addEventListener('DOMLoaded', () => {
				loadedCount++
				if (loadedCount === this.elements.images.length) {
					this.#setupTimeline(true)
				}
			})

			this.lotties.push(lampAnim)
		})
	}

	didDispose = () => {
		if (this.timeline) {
			this.timeline.kill()
			this.timeline = null
		}

		if (this.lotties) {
			this.lotties.forEach((animation) => {
				animation.destroy()
			})
			this.lotties = null
		}
	}
}

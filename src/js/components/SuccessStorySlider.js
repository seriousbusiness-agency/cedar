import { Component } from '@common/components'
import Swiper from 'swiper'
import { Navigation, EffectFade } from 'swiper/modules'
import AnimationTrigger from 'js/generic/AnimationTrigger'
import { queryAll, splitText, addClass, each, query, setProps } from '@common/util/function'
import gsap from 'gsap'

export default class SuccessStorySlider extends Component {
	doSetup = () => {
		this.willAutoPlay = true

		this.queryChildren({
			slider: '.success-story-slider__slider',
			prevButton: '.success-story-slider__button--prev',
			nextButton: '.success-story-slider__button--next',
			slides: ['.swiper-slide']
		})

		if (this.elements.slides.length === 1) this.willAutoPlay = false

		queryAll('[data-anim-keep]', this.element).forEach((el) => {
			if (el.hasAttribute('data-anims')) return
			AnimationTrigger.showSplitText(el, { type: 2, delay: 0, duration: 0.1, keep: true })
			// this.#showSplitText(el)
			setTimeout(() => {
				// this.#hideSplitText(el)
				AnimationTrigger.hideSplitText(el, { type: 2, delay: 0, duration: 1.1 }, true)
			}, 110)
		})

		queryAll('[data-anim-keeps]', this.element).forEach((el) => {
			if (el.hasAttribute('data-anims')) return
			AnimationTrigger.showFadeIn(el, { duration: 0.1, delay: 0 })
			setTimeout(() => {
				AnimationTrigger.hideFadeIn(el, { duration: 1.1, delay: 0 })
			}, 110)
		})
	}

	doStart = () => {
		queryAll('[data-anims="lines"]', this.element).forEach((el, i) => {
			AnimationTrigger.showSplitText(el, { type: 2, delay: 0.2 * i, duration: 0.75, keep: true })
		})

		queryAll('[data-anims="fadein"]', this.element).forEach((el) => {
			AnimationTrigger.showFadeIn(el, { duration: 0.75, delay: 0.6, stagger: 0.2 })
		})

		this.swiper = new Swiper(this.elements.slider, {
			modules: [Navigation, EffectFade],
			navigation: {
				prevEl: this.elements.prevButton,
				nextEl: this.elements.nextButton
			},
			fadeEffect: { crossFade: true },
			effect: 'fade'
		})

		this.swiper.on('slideChange', () => {
			// hide old slide
			this.#hideOldSlide()

			// show new slide
			this.#showNewSlide()
		})

		if (this.elements.slides.length > 1) this.#setupTimer()

		this.elements.prevButton.addEventListener('click', () => {
			this.willAutoPlay = false
			this.#killTimer()
		})
		this.elements.nextButton.addEventListener('click', () => {
			this.willAutoPlay = false
			this.#killTimer()
		})
	}

	#killTimer = () => {
		this.timeline.kill()
		gsap.to(this.elements.slider, { '--p': 0, duration: 0.45, ease: 'Quart.easeOut' })
	}

	#setupTimer = () => {
		if (!this.willAutoPlay) return

		if (this.timeline) {
			this.timeline.kill()
		}
		this.timeline = gsap.timeline({ paused: false })

		this.timeline.to(this.elements.slider, {
			'--p': 1,
			duration: 7,
			delay: 0.75,
			ease: 'none',
			onComplete: () => {
				gsap.to(this.elements.slider, { '--p': 0, duration: 0.45, ease: 'Quart.easeOut' })

				const nextElement = this.swiper.realIndex === this.elements.slides.length - 1 ? 0 : this.swiper.realIndex + 1

				this.swiper.slideTo(nextElement)
				console.log(this.willAutoPlay)
				if (this.willAutoPlay) this.#setupTimer()
			}
		})
	}

	#hideOldSlide = () => {
		setProps(this.element, { 'pointer-events': 'none' })

		gsap.fromTo(
			query('.success-story-slider__slide__logo img', this.elements.slides[this.swiper.previousIndex]),
			{
				y: '0%'
			},
			{
				y: '-101%',
				duration: 0.75,
				ease: 'Quart.easeOut'
			}
		)
		gsap.to(query('.success-story-slider__slide__image', this.elements.slides[this.swiper.previousIndex]), {
			autoAlpha: 0,
			duration: 0.75,
			ease: 'Quart.easeOut'
		})

		queryAll('[data-anim-keep]', this.elements.slides[this.swiper.previousIndex]).forEach((el) => {
			// setTimeout(() => {
			this.#hideSplitText(el)
			// }, i / 15)
		})

		queryAll('[data-anim-keeps]', this.elements.slides[this.swiper.previousIndex]).forEach((el) => {
			// setTimeout(() => {
			AnimationTrigger.hideFadeIn(el, { duration: 0.75, delay: 0 })
			// }, i / 15)
		})
	}

	#showNewSlide = () => {
		gsap.to(query('.success-story-slider__slide__image', this.elements.slides[this.swiper.realIndex]), {
			autoAlpha: 1,
			duration: 0.75,
			ease: 'Quart.easeOut',
			delay: 0.55
		})

		gsap.fromTo(
			query('.success-story-slider__slide__logo img', this.elements.slides[this.swiper.realIndex]),
			{
				y: '101%'
			},
			{
				y: '0%',
				autoAlpha: 1,
				duration: 0.75,
				ease: 'Quart.easeOut',
				delay: 0.55
			}
		)

		const onComplete = () => {
			console.log(2222)
			setProps(this.element, { 'pointer-events': 'all' })
		}
		queryAll('[data-anim-keep]', this.elements.slides[this.swiper.realIndex]).forEach((el, i) => {
			setTimeout(() => {
				this.#showSplitText(el, {
					onComplete:
						el === query('.success-story-slider__slide__paragraph', this.elements.slides[this.swiper.realIndex])
							? onComplete
							: () => {}
				})
			}, i * 200)
		})

		queryAll('[data-anim-keeps]:not(img)', this.elements.slides[this.swiper.realIndex]).forEach((el) => {
			setTimeout(
				() => {
					AnimationTrigger.showFadeIn(el, {
						duration: 0.75,
						delay: 0.55
					})
				},
				queryAll('[data-anim-keep]', this.elements.slides[this.swiper.realIndex]).length * 200
			)
		})
	}

	#hideSplitText = (el) => {
		const parts = queryAll('.word', el)
		if (parts && parts.length) {
			gsap.fromTo(
				parts,
				{
					y: '0%'
				},
				{
					y: '-100%',
					duration: 0.75,
					ease: 'Quart.easeOut',
					delay: 0,
					clearProps: ''
				}
			)
		}
	}

	#showSplitText = (el, params) => {
		addClass(el, 'split-text')
		const split = splitText(el, 2)

		// if (!params.type) addClass(el, 'chars')

		const parts = split.getParts()

		if (!parts.length) return

		const timeline = gsap.timeline({
			delay: 0.55,
			onComplete: () => {
				if (params.onComplete) params.onComplete()
			}
			// onComplete: () => {
			// 	// if (!params.keep) {
			// 	// 	split.revert(true)
			// 	// 	requestAnimationFrame(() => removeClass(el, 'split-text'))
			// 	// }
			// }
		})

		const lines = split.getLines()
		const speed = 5

		each(lines, (line, i) => {
			timeline.fromTo(
				line,
				{
					y: '101%'
					// clearProps: 'all'
				},
				{
					y: '0%',
					duration: 0.75,
					ease: 'Quart.easeOut'
				},
				i / speed
			)
		})
	}

	didInView = () => {
		// if (window.innerWidth >= 1024) return
		if (this.willAutoPlay) this.timeline.play()
	}

	didOutView = () => {
		// if (window.innerWidth >= 1024) return

		if (this.timeline) this.timeline.pause()
	}
}

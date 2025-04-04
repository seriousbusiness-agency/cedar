import { Component } from '@common/components'
import Swiper from 'swiper'
import { Navigation, EffectFade } from 'swiper/modules'
import AnimationTrigger from 'js/generic/AnimationTrigger'
import { queryAll, splitText, addClass, each, query } from '@common/util/function'
import gsap from 'gsap'

export default class FeaturesSlider extends Component {
	doSetup = () => {
		this.queryChildren({
			slider: '.features-slider__slider',
			prevButton: '.features-slider__button--prev',
			nextButton: '.features-slider__button--next',
			slides: ['.swiper-slide']
		})

		queryAll('[data-anim-keep]', this.element).forEach((el) => {
			if (el.hasAttribute('data-anim')) return
			AnimationTrigger.showSplitText(el, { type: 2, delay: 0, duration: 0.1, keep: true })
			// this.#showSplitText(el)
			setTimeout(() => {
				// this.#hideSplitText(el)
				AnimationTrigger.hideSplitText(el, { type: 2, delay: 0, duration: 1.1 }, true)
			}, 110)
		})

		queryAll('[data-anim-keeps]', this.element).forEach((el) => {
			if (el.hasAttribute('data-anim')) return
			AnimationTrigger.showFadeIn(el, { duration: 0.1, delay: 0 })
			setTimeout(() => {
				AnimationTrigger.hideFadeIn(el, { duration: 1.1, delay: 0 })
			}, 110)
		})
	}

	doStart = () => {
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
			console.log(this.elements.slides[this.swiper.realIndex])

			gsap.fromTo(
				queryAll('.features-slider__slide__item__image img', this.elements.slides[this.swiper.previousIndex]),
				{
					y: '0%'
				},
				{
					y: '-101%',
					duration: 0.75,
					ease: 'Quart.easeOut'
				}
			)

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

			gsap.fromTo(
				queryAll('.features-slider__slide__item__image img', this.elements.slides[this.swiper.realIndex]),
				{
					y: '101%'
				},
				{
					y: '0%',
					duration: 0.75,
					ease: 'Quart.easeOut',
					delay: 0.65,
					stagger: 0.2
				}
			)

			queryAll('[data-anim-keep]', this.elements.slides[this.swiper.realIndex]).forEach((el, i) => {
				setTimeout(() => {
					this.#showSplitText(el)
				}, i * 200)
			})

			queryAll('[data-anim-keeps]', this.elements.slides[this.swiper.realIndex]).forEach((el) => {
				setTimeout(
					() => {
						AnimationTrigger.showFadeIn(el, { duration: 0.75, delay: 0.55 })
					},
					queryAll('[data-anim-keep]', this.elements.slides[this.swiper.realIndex]).length * 200
				)
			})
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

	#showSplitText = (el) => {
		addClass(el, 'split-text')
		const split = splitText(el, 2)

		// if (!params.type) addClass(el, 'chars')

		const parts = split.getParts()

		if (!parts.length) return

		const timeline = gsap.timeline({
			delay: 0.55,
			onComplete: () => {
				// if (!params.keep) {
				// 	split.revert(true)
				// 	requestAnimationFrame(() => removeClass(el, 'split-text'))
				// }
			}
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
}

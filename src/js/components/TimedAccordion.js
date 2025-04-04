import { Component } from '@common/components'
import { hasClass, query, removeClass, addClass, setProps } from '@common/util/function'
import gsap from 'gsap'

export default class TimedAccordion extends Component {
	doSetup = () => {
		this.willAutoPlay = window.innerWidth >= 768
	}

	doStart = () => {
		this.queryChildren({
			content: ['.tabs__item__paragraph'],
			items: ['.tabs__item'],
			images: ['.tabs__item__image']
		})

		if (window.innerWidth < 768) return
		this.elements.items.forEach((item) => item.addEventListener('click', this.#handleClick))
		this.#handleClick({ currentTarget: this.elements.items[0] })
		this.#changeImage(null, 0)

		if (this.willAutoPlay) this.#setupTimer()
	}

	#handleClick = (e) => {
		if (hasClass(e.currentTarget, 'active')) return
		if (this.timeline) this.timeline.pause()
		gsap.killTweensOf(this.element)
		this.elements.items.forEach((item) => gsap.to(item, { '--p': 0 }))
		const index = Array.from(e.currentTarget.parentElement.children).indexOf(e.currentTarget)
		const currentActiveImage = query('figure.active', this.element)

		this.#changeImage(currentActiveImage, index)

		this.elements.items.forEach((item) => removeClass(item, 'active'))
		addClass(e.currentTarget, 'active')

		this.elements.content.forEach((content) => setProps(content, { 'max-height': `0px` }))
		setProps(this.elements.content[index], { 'max-height': `${this.elements.content[index].scrollHeight}px` })

		this.elements.images.forEach((image) => removeClass(image, 'active'))
		addClass(this.elements.images[index], 'active')

		if (!e.type) {
			if (this.willAutoPlay) this.#setupTimer()
		} else {
			this.willAutoPlay = false
		}
	}

	#changeImage = (currentActiveImage, index) => {
		this.elements.images.forEach((image) => {
			gsap.killTweensOf(image)
			gsap.set(image, { 'z-index': 1 })
		})

		if (currentActiveImage) {
			// Set z-index of the current active image to a higher value before animation starts
			gsap.set(currentActiveImage, { 'z-index': 5 })

			gsap.fromTo(
				currentActiveImage,
				{
					'--i': '0%',
					'--f': '0%'
				},
				{
					'--i': '100%',
					'--f': '100%',
					duration: 0.55,
					ease: 'Quart.easeOut',
					onComplete: () => {
						// Set z-index of the current image back to 1 after animation completes
						gsap.set(currentActiveImage, {
							'--i': '0%',
							'--f': '0%',
							'z-index': 1
						})
					}
				}
			)
		}

		// Set initial values for the clicked image and its z-index to ensure it's on top
		gsap.set(this.elements.images[index], {
			'--i': '0%',
			'--f': '0%',
			'z-index': 2
		})
	}

	#setupTimer = () => {
		if (this.timeline) {
			this.timeline.kill()
		}
		this.timeline = gsap.timeline({ paused: false })
		const firstIndex = Array.from(query('.tabs__item.active', this.element).parentElement.children).indexOf(
			query('.tabs__item.active', this.element)
		)
		this.timeline.to(this.elements.items[firstIndex], {
			'--p': 1,
			duration: 10,
			ease: 'none',
			onComplete: () => {
				const index = Array.from(query('.tabs__item.active', this.element).parentElement.children).indexOf(
					query('.tabs__item.active', this.element)
				)

				gsap.to(this.elements.items[index], { '--p': 0 })

				const nextElement = this.elements.items[index].nextElementSibling
					? this.elements.items[index].nextElementSibling
					: this.elements.items[0]

				this.#handleClick({ currentTarget: nextElement })
			}
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

	didResize = () => {}
}

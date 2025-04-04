import { Component } from '@common/components'
import { Cursor } from '@common/cursor'
import { addClass, getRect, query, removeClass, setProps, toggleClass } from '@common/util/function'
import gsap, { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

export default class Video extends Component {
	doStart = () => {
		this.queryChildren({
			video: '.video__video',
			wrapper: '.video__video__wrapper',
			container: '.video__video__container',
			cursor: '.video__video__cursor',
			videoElement: 'video',
			videoThumb: '.video__video__thumb'
		})

		this.originalVideoHeight = getRect(this.elements.videoElement).height

		if (window.innerWidth >= 1023) {
			// video growing animation
			gsap.to(this.elements.container, {
				width: '100%',
				height: window.innerWidth >= 1023 ? '' : '41.25rem',
				scrollTrigger: {
					trigger: this.elements.wrapper,
					start: 'top 40%',
					end: window.innerWidth >= 1023 ? '+=70%' : '+=40%',
					pin: true,
					pinSpacing: true,
					pinSpacer: true,
					scrub: true,
					markers: false,
					ease: 'Quart.easeOut',
					duration: 1,
					onLeaveBack: () => {
						removeClass(this.element, 'dark')
						setProps(document.body, { 'background-color': 'var(--light-gray)' })
					},
					onEnter: () => {
						addClass(this.element, 'dark')
						setProps(document.body, { 'background-color': 'var(--dark-gray)' })
					}
				}
			})

			// leave background animation
			ScrollTrigger.create({
				trigger: this.elements.container,
				start: window.innerWidth >= 1023 ? '200% 60%' : '180% 60%',
				end: window.innerWidth >= 1023 ? '200% 60%' : '180% 60%',
				markers: false,
				onEnter: () => {
					setProps(document.body, { 'background-color': 'var(--light-gray)' })
				},
				onEnterBack: () => {
					setProps(document.body, { 'background-color': 'var(--dark-gray)' })
				}
			})
		}

		this.#handleCursor()

		this.elements.cursor.addEventListener('click', this.#toggle)
	}

	#handleCursor = () => {
		this.cursor = new Cursor(query('.wrapper', this.elements.cursor), this.elements.cursor, { inertia: 0.1 })

		this.cursor.scan()
		this.cursor.start()

		window.cursor = this.cursor

		window.requestAnimationFrame(() => {
			const x = getRect(this.elements.cursor).width * 0.5
			const y = getRect(this.elements.cursor).height * 0.5

			this.cursor.tracker.set([x, y])
		})

		this.cursor.didAddClass = () => {
			addClass(this.elements.cursor, 'active')
		}

		this.cursor.didRemoveClass = () => {
			removeClass(this.elements.cursor, 'active')

			// const x = getRect(this.elements.cursor).width * 0.5
			// const y = getRect(this.elements.cursor).height * 0.5

			// this.cursor.tracker.set([x, y])
		}
	}

	#toggle = () => {
		// toggleClass(this.elements.cursor, 'playing')
		toggleClass(this.elements.cursor, 'playing')
		if (this.playing) this.#pause()
		else this.#play()
	}

	#pause = () => {
		this.elements.videoElement.pause()
		this.playing = false
		if (window.innerWidth < 1023) setProps(this.elements.videoThumb.element, { height: `100%` })
	}

	#play = () => {
		this.elements.videoElement.play()
		this.playing = true
		if (window.innerWidth < 1023)
			setProps(this.elements.videoThumb.element, { height: `${this.originalVideoHeight}px` })
	}

	didDispose = () => {
		if (this.elements.container) {
			gsap.killTweensOf(this.elements.container)
		}
		ScrollTrigger.getAll().forEach((st) => st.kill())
		if (this.cursor) {
			this.cursor.clean()
			this.cursor = null
		}
	}
}

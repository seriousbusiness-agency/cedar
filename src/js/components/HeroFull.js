import { Component } from '@common/components'
import { Cursor } from '@common/cursor'
import { addClass, getRect, query, removeClass, setProps } from '@common/util/function'

export default class HeroFull extends Component {
	doStart = () => {
		this.queryChildren({
			cursor: '.hero-full__cursor',
			videoElement: 'video',
			posterImage: '.hero-full__image img',
			content: '.hero-full__content'
		})

		if (!this.elements.videoElement) return

		this.originalVideoHeight = getRect(this.elements.videoElement).height
		this.originalPosterSrc = this.elements.posterImage?.getAttribute('src')

		this.#handleCursor()

		this.elements.cursor.addEventListener('click', this.#toggle)
		this.elements.videoElement.addEventListener('pause', this.#pause)
		this.elements.videoElement.addEventListener('ended', this.#pause)
	}

	#pause = () => {
		removeClass(this.elements.cursor, 'playing')

		// Create a canvas to capture the current frame
		const canvas = document.createElement('canvas')
		canvas.width = this.elements.videoElement.videoWidth
		canvas.height = this.elements.videoElement.videoHeight

		// Draw the current frame to the canvas
		const ctx = canvas.getContext('2d')
		ctx.drawImage(this.elements.videoElement, 0, 0, canvas.width, canvas.height)

		// Update the poster image src
		if (this.elements.posterImage) {
			this.elements.posterImage.src = canvas.toDataURL()
		}

		this.elements.videoElement.pause()
		this.playing = false
		setProps(this.elements.content, { opacity: 1 })
		setProps(this.elements.posterImage, { opacity: 1 })
	}

	#play = () => {
		// Reset poster image to original when playing
		// if (this.elements.posterImage && this.originalPosterSrc) {
		// 	this.elements.posterImage.src = this.originalPosterSrc
		// }

		addClass(this.elements.cursor, 'playing')

		this.elements.videoElement.play()
		this.playing = true
		setProps(this.elements.content, { opacity: 0 })
		setProps(this.elements.posterImage, { opacity: 0 })
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
		if (this.playing) this.#pause()
		else this.#play()
	}

	didDispose = () => {
		if (this.cursor) {
			this.cursor.clean()
			this.cursor = null
		}
	}
}

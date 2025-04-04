import { Component } from '@common/components'
import { Cursor } from '@common/cursor'
import { addClass, getRect, query, removeClass, setProps, toggleClass } from '@common/util/function'

export default class ArticleVideo extends Component {
	doSetup = () => {
		this.queryChildren({
			video: '.article-video__video',
			wrapper: '.article-video__video__wrapper',
			container: '.article-video__video__container',
			cursor: '.article-video__video__cursor',
			videoElement: 'video',
			videoThumb: '.article-video__video__thumb',
			poster: '.poster'
		})

		if (window.innerWidth >= 1024) this.#handleCursor()

		this.elements.cursor.addEventListener('click', this.#toggle)
	}

	doStart = () => {
		this.originalVideoHeight = getRect(this.elements.videoElement).height
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

			const x = getRect(this.elements.cursor).width * 0.5
			const y = getRect(this.elements.cursor).height * 0.5

			this.cursor.tracker.set([x, y])
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
		setProps(this.elements.videoThumb.element, { height: `100%` })
	}

	#play = () => {
		this.elements.videoElement.play()
		this.playing = true

		setProps([this.elements.poster, this.elements.videoElement], { position: '' })
		setProps(this.elements.poster, { opacity: 0, visibility: 'hidden' })
		// if (window.innerWidth < 1024)
		setProps(this.elements.videoThumb.element, { height: `${this.originalVideoHeight}px` })
	}

	didDispose = () => {
		if (this.cursor) {
			this.cursor.clean()
			this.cursor = null
		}
	}
}

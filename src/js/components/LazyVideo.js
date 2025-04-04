import { Component } from '@common/components'
import { setAttributes, setProps } from '@common/util/function'

export default class LazyVideo extends Component {
	bp

	forceHideVide = false
	playing = false

	fixingSafari = false
	safariReady = false

	doSetup = () => {
		this.queryChildren({
			poster: '.poster',
			video: 'video'
		})

		if (this.elements.video) this.elements.video.pause()

		if (this.elements && this.elements.poster) {
			setProps(this.elements.poster, { position: 'relative' })
			setProps(this.elements.video, { position: 'absolute' })
		}
	}

	doStart = () => {
		if (this.elements.video) {
			const src = this.elements.video.attributes['data-src']
			if (src) setAttributes(this.elements.video, { 'data-src': '', src: `${src.value}` })
			this.elements.video.addEventListener(
				'playing',
				() => {
					if (this.elements && this.elements.poster && this.elements.poster.parentNode) {
						setProps([this.elements.poster, this.elements.video], { position: '' })
						setProps(this.elements.poster, { opacity: 0, visibility: 'hidden' })
						// this.elements.poster.remove()
					}
				},
				{ once: true }
			)

			requestAnimationFrame(() => {
				if (this.playing) this.play()
			})
		}
	}

	didInView = () => {
		if (!this.forceHideVide && this.elements.video) {
			const { 'data-video': data } = this.element.attributes
			if (data && data.value === 'autoplay') this.play()

			this.didResize()
		}
	}

	get paused() {
		return this.elements.video ? this.elements.video.paused : true
	}

	get currentTime() {
		return this.elements.video ? this.elements.video.currentTime : 0
	}

	set currentTime(value) {
		if (this.elements.video) this.elements.video.currentTime = value
	}

	hideVideo = (value) => {
		console.log(value)
	}

	play = () => {
		if (!this.forceHideVide && this.elements.video) {
			this.playing = true
			this.elements.video.pause()

			this.elements.video.play().catch((e) => console.log(e))
		}
	}

	pause = () => {
		if (this.elements.video && !this.paused) {
			this.playing = false
			this.elements.video.pause()
		}
	}

	didOutView = () => {
		if (!this.forceHideVide && this.elements.video) {
			this.pause()
		}
	}

	didDispose = () => {
		if (this.elements.video) this.elements.video.pause()
	}

	didResize = () => {
		// if (this.elements.poster && this.elements.poster.parentNode && isIOS()) {
		// 	const rect = getRect(this.elements.poster)
		// 	if (rect.width && rect.height) {
		// 		setProps(this.element, {
		// 			width: `${rect.width}px`,
		// 			height: `${rect.height}px`
		// 		})
		// 	}
		// }
	}
}

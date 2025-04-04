import { Component } from '@common/components'
import { Observer } from '@common/observer'
import { breakpoint } from '@common/util/function'

export default class FullServiceItem extends Component {
	isPlaying = false
	bp

	doStart = () => {
		this.queryChildren({
			// video: 'video'
			video: '.cards__item__image'
		})

		if (this.elements.video) {
			this.bp = breakpoint('max-tablet', () => {
				const togglePlayPause = (_, entry) => {
					if (entry.isIntersecting) this.play()
					else this.pause()
				}

				Observer.observe(0, this.elements.video.element, togglePlayPause)

				return () => {
					if (this.elements.video) {
						Observer.unobserve(0, this.elements.video.element, togglePlayPause)
						this.pause()
					}
				}
			})
		}
	}

	play = () => {
		this.isPlaying = true
		if (this.isInView && this.elements.video) this.elements.video.play()
	}

	pause = () => {
		this.isPlaying = false
		if (this.elements.video) this.elements.video.pause()
	}

	didInView = () => {
		if (this.isPlaying && this.elements.video) this.elements.video.play()
	}

	didOutView = () => {
		if (this.isPlaying && this.elements.video) this.elements.video.pause()
	}

	didDispose = () => {
		if (this.bp) this.bp.revert()
	}
}

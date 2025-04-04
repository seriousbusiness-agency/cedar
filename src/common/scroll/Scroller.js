import gsap, { ScrollTrigger } from 'gsap/all'
import Lenis from 'lenis'

export default class Scroller extends Lenis {
	// poppingScrollY = null
	// mcgyver

	constructor(props, mcgyver) {
		super(props)

		// this.mcgyver = mcgyver

		// window.addEventListener('popstate', this.#popHandler)
		this.on('scroll', this.#scrollHandler)

		gsap.ticker.add((time) => this.raf(time * 1000))
		gsap.ticker.lagSmoothing(0)

		// if (isIOS()) ScrollTrigger.normalizeScroll(true)
	}

	// #popHandler = () => {
	// 	this.poppingScrollY = window.scrollY
	// }

	#scrollHandler = () => {
		// if (!this.mcgyver && Number.isFinite(this.poppingScrollY)) {
		// 	this.scrollTo(this.poppingScrollY, { immediate: true, lock: true, force: true })
		// 	this.poppingScrollY = null
		// }
		ScrollTrigger.update()
	}

	paused = (value) => {
		if (value) this.stop()
		else this.start()
	}

	scrollTop = (value) => {
		window.scrollTo(0, value)
		this.scrollTo(value, { immediate: true, lock: true, force: true })
	}

	destroy() {
		// window.removeEventListener('popstate', this.#popHandler)
		this.off('scroll', this.#scrollHandler)
		super.destroy()
	}
}

import { Component } from '@common/components'
import MotherLoader from '@common/loader/MotherLoader'
import { addClass, createElement, delayedCall, queryAll, removeClass } from '@common/util/function'
import gsap from 'gsap'

import 'scss/essential.scss'

class Preloader extends Component {
	animationComplete = false
	loaderComplete = false

	constructor() {
		super('.main-preloader')

		this.elements = queryAll({
			root: 'html',
			navbar: '.navbar',
			hero: '.hero'
		})

		this.queryChildren({})

		this.init()
		this.loadAssets()
	}

	loadAssets = () => {
		const cssPath = `${window.baseURL}/css`
		const jsPath = `${window.baseURL}/js`

		const mainLoader = new MotherLoader({
			verbose: window.debug,
			baseURL: window.baseURL
		})

		mainLoader.scan(this.elements.navbar)

		if (!window.dev || window.extract) {
			mainLoader.add('main.css', {
				path: cssPath,
				el: createElement('link', { rel: 'stylesheet', as: 'style' })
			})
		}
		// if (window.dev) {
		mainLoader.add('main.js', {
			path: jsPath,
			el: createElement('script', { defer: 'true' })
		})
		// }

		mainLoader.once('complete_all', () => {
			this.loaderComplete = true
			this.checkReady()
		})

		const essentialLoader = new MotherLoader({
			verbose: window.debug,
			baseURL: window.baseURL
		})
		essentialLoader.once('complete_all', () => {
			this.startAnimation()
			if (mainLoader.readyToStart) mainLoader.start()
			else mainLoader.once('ready', mainLoader.start)
		})
		essentialLoader.scan(this.element).then(essentialLoader.start)

		removeClass(this.element, 'hide')
		addClass(this.element, 'hidden')

		window.mainLoader = mainLoader
	}

	doStart = () => {
		// prevent pinch
		document.addEventListener('gesturestart', (e) => e.preventDefault())
	}

	checkReady = () => {
		if (this.animationComplete && this.loaderComplete) {
			window.main = new window.Main()
			window.main.once('ready', () => {
				// after main.js is ready finish logo animation
				this.finishAnimation()
			})
			window.main.setup()
		}
	}

	startAnimation = () => {
		removeClass(this.element, 'hidden')

		// function to finish animation after main.js is ready. Fix to improve the performance of the initial animation
		this.finishAnimation = () => {
			gsap.to(this.element, {
				autoAlpha: 0,
				duration: 0.3,
				onStart: () => {
					window.main.ready()
					this.emit('finishanimation')
				}
			})
		}

		delayedCall(() => {
			this.animationComplete = true
			this.checkReady()
		}, 1400)
	}
}

window.addEventListener(
	'DOMContentLoaded',
	() => {
		window.preloader = new Preloader()
	},
	{ once: true }
)

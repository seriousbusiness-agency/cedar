import 'scss/main.scss'

import { Component } from '@common/components'
import Components from '@common/components/Components'
import Transition from '@common/router/PageTransition'
import Router from '@common/router/Router'
import Scroller from '@common/scroll/Scroller'
import { addClass, delayedCall, fixResizeObserver, queryComponents, removeClass, setProps } from '@common/util/function'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap/all'
import AnimationTrigger from './generic/AnimationTrigger'

import Card from './components/Card'
import Cards from './components/Cards'
import CookieConsent from './components/CookieConsent'
import CookieConsentItem from './components/CookieConsentItem'
import Hero from './components/Hero'
import MaskHover from './components/MaskedHover'
import Navbar from './components/Navbar'
import SwitchButton from './components/SwitchButton'
import TimedAccordion from './components/TimedAccordion'
import Homepage from './pages/homepage/Homepage'
import LazyVideo from './components/LazyVideo'
import Features from './components/Features'
import GetStarted from './components/GetStarted'

gsap.registerPlugin(ScrollTrigger)

class Main extends Component {
	introFinished = false

	constructor() {
		super('main')
	}

	setup = () => {
		console.log('init main!!!!')

		this.init()

		fixResizeObserver()

		Components.register({
			navbar: Navbar,
			'cookie-consent': CookieConsent,
			'cookie-consent-item': CookieConsentItem,
			'switch-button': SwitchButton,
			button: MaskHover,
			hero: Hero,
			cards: Cards,
			'cards-item': Card,
			'timed-accordion': TimedAccordion,
			'lazy-video': LazyVideo,
			features: Features,
			start: GetStarted
		})

		Router.register({
			homepage: Homepage
		})

		window.scrollTo(0, 0)

		this.router = Router.getInstance()
		this.scroller = new Scroller()
		window.scroll = this.scroller

		this.scroller.stop()
		this.router.setPageTransition(new Transition())
		this.router.start(['head title', 'main', 'nav', 'footer', '.cookie-consent-wrapper'])

		this.router.on('transitionstart', () => {
			this.scroller.stop()
		})
		this.router.on('transitionhide', () => {
			this.scroller.scrollTop(0)
		})
		this.router.on('transitionshow', () => {
			this.scroller.start()
		})
		this.router.on('updatedom', this.#handlerUpdateDom)

		// ====
		this.#scanDom()

		this.elements = queryComponents({
			root: '.root',
			navbar: '.navbar',
			wrapper: '.wrapper'
		})

		// induce start components
		removeClass(this.elements.root, 'hide')
		addClass(this.elements.root, 'hidden', 'disable-all')

		// check if page needs await to be ready
		requestAnimationFrame(() => {
			const currentPage = this.router.getCurrentPage()
			if (currentPage.isReady) this.emit('ready')
			else {
				currentPage.once('ready', () => {
					this.emit('ready')
				})
			}
		})
	}

	ready = () => {
		this.finishIntro()
	}

	#scanDom = () => {
		this.scroller.start()
		const currentPage = this.router.getCurrentPage()
		const scanAnimationTrigger = () => {
			this.animationTrigger = AnimationTrigger.scan(document, true)
			this.animationTrigger.once('init', () => this.emit('animation_trigger'))
		}

		Components.scan(true)
		if (currentPage.isReady) scanAnimationTrigger()
		else currentPage.once('ready', scanAnimationTrigger)
	}

	#handlerUpdateDom = () => {
		this.#scanDom()

		delayedCall(() => this.animationTrigger.init(), this.router.getCurrentPage().delayToInitTrigger || 500)

		this.didResize(true)
	}

	finishIntro = () => {
		removeClass(this.elements.root, 'hidden', 'disable-all')

		this.scroller.scrollTop(0)
		this.scroller.start()
		window.preloader.emit('finishanimation')
		// window.preloader.element.remove()
		window.preloader.dispose()
		this.animationTrigger.init()
		this.emit('finishintro')

		// fix for ios safari bug
		setProps(this.elements.wrapper, { transform: '' })

		// fix if scroll starts after 0
		requestAnimationFrame(() => this.scroller.scrollTop(0))
	}

	didResize = (forceFix) => {
		setProps(document.body, {
			'--svh': `${document.documentElement.clientHeight}px`,
			'--dvh': `${window.innerHeight}px`
		})

		// fix for ios safari bug
		if (forceFix || (this.introFinished && this.lastWidth !== window.innerWidth)) {
			// fix invalidateOnRefresh
			if (this.delayedSTRefresh) this.delayedSTRefresh.kill()
			this.delayedSTRefresh = gsap.delayedCall(0.1, () => ScrollTrigger.refresh())

			this.lastWidth = window.innerWidth
		}
		// end fix
	}
}

window.Main = Main

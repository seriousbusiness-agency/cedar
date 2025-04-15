import { Component } from '@common/components'
import Scroller from '@common/scroll/Scroller'
import {
	addClass,
	addEventListeners,
	each,
	getRect,
	queryAll,
	removeClass,
	removeEventListeners,
	setProps
} from '@common/util/function'
import gsap from 'gsap/all'
import Cookies from 'js-cookie'

const COOKIE_NAME = 'cookie.cedar'

export default class CookieConsent extends Component {
	currentModule
	scroller

	doStart = () => {
		const cookie = Cookies.get(COOKIE_NAME)

		this.elements = queryAll({
			wrapper: '.cookieconsent__wrapper',
			main: '.cookieconsent__main',
			prefs: {
				element: '.cookieconsent__prefs',
				scroll: '.cookieconsent__scroll',
				items: ['.cookieconsent__item']
			},
			acceptBt: ['.accept-all-bt'],
			declineBt: ['.decline-bt'],
			prefsBt: ['.manage-prefs-bt'],
			saveBt: ['.save-bt'],
			closeBt: ['.cookieconsent__close']
		})

		this.open()

		if (cookie && cookie !== '') {
			console.log('COOKIE', cookie)
			addClass(this.element, 'hide', 'disable')
			// this.element.remove()
			// return
		}

		this.elements.preferences = document.querySelectorAll('[href="#cookie"], [href="#cookies"]')
		this.currentModule = this.elements.main

		addEventListeners(this.elements.preferences, 'click', this.open)

		this.scroller = new Scroller(
			{ wrapper: this.elements.prefs.scroll, content: this.elements.prefs.scroll.children[0] },
			true
		)
		this.scroller.paused(true)
	}

	acceptAll = () => {
		const json = {}
		each(this.elements.prefs.items, (item) => {
			json[item.getAttribute('data-name')] = [...item.getAttribute('data-value').split(',')]
		})
		Cookies.set(COOKIE_NAME, JSON.stringify(json), { expires: 180 })

		this.#allowAnalytics()
		this.close()
	}

	decline = () => {
		Cookies.set(COOKIE_NAME, 'declined', { expires: 180 })
		this.close()
	}

	save = () => {
		const json = {}
		each(this.elements.prefs.items, (item) => {
			if (item.checked) {
				json[item.name] = [...item.value.split(',')]
				if (item.value.includes('analytics')) this.#allowAnalytics()
			}
		})
		Cookies.set(COOKIE_NAME, JSON.stringify(json), { expires: 180 })

		this.close()
	}

	#allowAnalytics = () => {
		if (window.allowAnalytics) window.allowAnalytics()
	}

	open = () => {
		removeClass(this.element, 'hide', 'disable', 'finish')

		addEventListeners(this.elements.closeBt, 'click', this.showMain)
		addEventListeners(this.elements.prefsBt, 'click', this.showPrefs)
		addEventListeners(this.elements.acceptBt, 'click', this.acceptAll)
		addEventListeners(this.elements.declineBt, 'click', this.decline)
		addEventListeners(this.elements.saveBt, 'click', this.save)

		gsap.fromTo(this.element, { autoAlpha: 0 }, { autoAlpha: 1 })
	}

	close = () => {
		// const handler = (e) => {
		// 	if (e.propertyName === 'translate') {
		// 		// this.elements.wrapper.removeEventListener('transitionend', handler)
		// 		// this.element.remove()
		// 	}
		// }

		// this.elements.wrapper.addEventListener('transitionend', handler)

		removeEventListeners(this.elements.closeBt, 'click', this.showMain)
		removeEventListeners(this.elements.prefsBt, 'click', this.showPrefs)
		removeEventListeners(this.elements.acceptBt, 'click', this.acceptAll)
		removeEventListeners(this.elements.declineBt, 'click', this.decline)
		removeEventListeners(this.elements.saveBt, 'click', this.save)

		addClass(this.element, 'disable', 'finish')
		// removeClass(this.element, 'once-inview')
	}

	showMain = () => {
		this.#showModule(this.elements.main)
	}

	showPrefs = () => {
		this.#showModule(this.elements.prefs.element)
	}

	#showModule = (module) => {
		addClass(this.element, 'disable')

		const currentRect = getRect(this.elements.wrapper)

		removeClass(module, 'hide')
		addClass(this.currentModule, 'hide')

		const nextRect = getRect(this.elements.wrapper)

		addClass(module, 'hide')
		removeClass(this.currentModule, 'hide')
		setProps([this.currentModule, module], { position: 'absolute' })

		gsap.set(this.currentModule, { width: currentRect.width, height: currentRect.height })
		gsap
			.timeline({
				onComplete: () => {
					addClass(this.currentModule, 'hide')
					setProps([this.currentModule, module], { position: '' })
					removeClass(this.element, 'disable')

					this.currentModule = module
				}
			})
			.to(this.currentModule, { opacity: 0, duration: 0.5, ease: 'Quad.easeInOut', clearProps: 'all' }, 0)
			.fromTo(
				this.elements.wrapper,
				{ width: currentRect.width, height: currentRect.height },
				{ width: nextRect.width, height: nextRect.height, duration: 0.5, ease: 'Quad.easeInOut', clearProps: 'all' },
				0
			)
			.fromTo(
				module,
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 0.5,
					ease: 'Quad.easeInOut',
					onStart: () => removeClass(module, 'hide'),
					clearProps: 'all'
				},
				0
			)
	}

	didInView = () => {
		if (this.scroller) this.scroller.paused(false)
	}

	didOutView = () => {
		if (this.scroller) this.scroller.paused(true)
		// this.dispose(true)
	}

	didDispose = () => {
		if (this.scroller) {
			this.scroller.destroy()
			removeEventListeners(this.elements.closeBt, 'click', this.showMain)
			removeEventListeners(this.elements.prefsBt, 'click', this.showPrefs)
		}
	}
}

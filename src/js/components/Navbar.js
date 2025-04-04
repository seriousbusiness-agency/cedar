import { Component } from '@common/components'
import { hasClass, removeClass, addClass, queryAll, setProps, toggleClass } from '@common/util/function'

export default class Navbar extends Component {
	doStart = () => {
		this.elements = queryAll({
			openButton: '.navbar__close',
			// buttonsWrapper: '.navbar__links__translate-buttons-wrapper'
			wrapper: '.navbar__wrapper',
			dropdowns: ['.navbar__link.navbar__link--dropdown']
		})

		window.preloader.on('finishanimation', () => {
			setProps(this.elements.wrapper, { overflow: 'visible' })
		})

		setTimeout(() => {
			setProps(this.elements.wrapper, { overflow: 'visible' })
		}, 750)

		// if (window.location.href.includes('/de/')) {
		// 	removeClass(queryAll('.navbar__links__translate-button')[1], 'not-active')
		// 	addClass(queryAll('.navbar__links__translate-button')[0], 'not-active')
		// } else {
		// 	removeClass(queryAll('.navbar__links__translate-button')[0], 'not-active')
		// 	addClass(queryAll('.navbar__links__translate-button')[1], 'not-active')
		// }

		this.addEventListeners()
	}

	#toggleClass = () => {
		if (!hasClass(this.element, 'active')) window.scroll.stop()
		else {
			window.scroll.start()
			this.elements.dropdowns.forEach((dropdown) => {
				removeClass(dropdown, 'active')
			})
		}
		toggleClass(this.element, 'active')
	}

	#update = (e) => {
		const { scrollY } = window

		if (scrollY > 0) {
			const hasBg = hasClass(this.element, 'show-bg')
			const hasCollapse = hasClass(this.element, 'collapse')
			const distance = window.innerHeight * 0.075

			if (scrollY > distance && !hasBg) addClass(this.element, 'show-bg')
			else if (scrollY <= distance && hasBg) removeClass(this.element, 'show-bg')

			if (e.direction > 0 && !hasCollapse) addClass(this.element, 'collapse')
			else if (e.direction < 0 && hasCollapse) removeClass(this.element, 'collapse')
		} else {
			removeClass(this.element, 'collapse', 'show-bg')
		}
	}

	handleLanguages() {
		queryAll('.navbar__links__translate-button').forEach((lang, index) => {
			const languages = queryAll('.wpml-ls-link')
			if (!languages.length || languages.length === 1) return
			lang.href = languages[index].href
		})
	}

	#toggleDropdown = (e) => {
		// Close all other dropdowns first
		this.elements.dropdowns.forEach((dropdown) => {
			if (dropdown !== e.currentTarget) {
				removeClass(dropdown, 'active')
			}
		})
		// Toggle the clicked dropdown
		toggleClass(e.currentTarget, 'active')

		// Handle fadeout elements
		const fadeElements = queryAll('.navbar__languages-wrapper, .navbar__contact-button.mobile-only, .navbar__button')

		// Check if any dropdown is active
		const hasActiveDropdown = Array.from(this.elements.dropdowns).some((dropdown) => hasClass(dropdown, 'active'))

		fadeElements.forEach((element) => {
			if (hasActiveDropdown) {
				addClass(element, 'fadeout')
			} else {
				removeClass(element, 'fadeout')
			}
		})
	}

	addEventListeners = () => {
		window.scroll.on('scroll', this.#update)
		this.elements.openButton.addEventListener('click', this.#toggleClass)
		this.elements.dropdowns.forEach((dropdown) => {
			dropdown.addEventListener('click', this.#toggleDropdown)
		})
	}

	didDispose = () => {
		window.scroll.off('scroll', this.#update)
		this.elements.openButton.removeEventListener('click', this.#toggleClass)
	}

	didResize = () => {
		if (window.innerWidth >= 768 && hasClass(this.element, 'active')) this.#toggleClass()
	}
}

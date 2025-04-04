import { Component } from '@common/components'
import { addClass, hasClass, removeClass } from '@common/util/function'
import gsap from 'gsap/all'

// let currentItem

export default class CookieConsentItem extends Component {
	name
	value

	doStart = () => {
		this.queryChildren({
			swich: '[data-component="switch-button"]',
			header: {
				svg: 'header svg',
				title: '.cookieconsent__tab-title'
			},
			tab: '.cookieconsent__tab-content'
		})

		const { 'data-name': name, 'data-value': value } = this.element.attributes

		this.name = this.element.getAttribute('data-name')
		this.value = this.element.getAttribute('data-value')

		this.elements.header.title.addEventListener('click', this.toggle)
	}

	doSetup = () => {
		this.startComponent()
	}

	get checked() {
		return this.elements.swich ? this.elements.swich.value : true
	}

	toggle = () => {
		if (hasClass(this.element, 'expanded')) this.collapse()
		else this.expand()
	}

	expand = () => {
		addClass(this.element, 'expanded')

		// if (currentItem) currentItem.collapse()
		// currentItem = this

		gsap.to(this.elements.tab, { height: 'auto', ease: 'Quart.easeOut' })
	}

	collapse = () => {
		removeClass(this.element, 'expanded')

		// currentItem = null

		gsap.to(this.elements.tab, { height: 0, ease: 'Quart.easeOut' })
	}

	didDispose = () => {
		this.elements.header.title.removeEventListener('click', this.toggle)
	}
}

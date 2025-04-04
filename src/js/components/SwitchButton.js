import { Component } from '@common/components'
import { addClass, hasClass, removeClass } from '@common/util/function'

export default class SwitchButton extends Component {
	doStart = () => {
		this.element.addEventListener('click', this.toggle)
	}

	get value() {
		return hasClass(this.element, 'active')
	}

	toggle = () => {
		if (hasClass(this.element, 'active')) this.disable()
		else this.enable()
	}

	enable = () => {
		addClass(this.element, 'active')
	}

	disable = () => {
		removeClass(this.element, 'active')
	}

	didDispose = () => {
		this.element.removeEventListener('click', this.toggle)
	}
}

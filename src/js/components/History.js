import { Component } from '@common/components'
import { setProps } from '@common/util/function'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
export default class History extends Component {
	doStart = () => {
		this.queryChildren({
			itemsWrapper: '.history__items'
		})

		this.st = ScrollTrigger.create({
			trigger: this.elements.itemsWrapper,
			start: 'top 40%',
			end: 'bottom center',
			onUpdate: (self) => {
				setProps(this.elements.itemsWrapper, { '--progress': self.progress })
			}
		})
	}

	didDispose = () => {
		if (this.st) this.st.kill()
	}
}

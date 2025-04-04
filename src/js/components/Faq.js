import { Component } from '@common/components'
import { hasClass, removeClass, addClass, setProps, query } from '@common/util/function'
import gsap from 'gsap'

export default class Faq extends Component {
	doStart = () => {
		this.queryChildren({
			content: ['.faq__item__content'],
			items: ['.faq__item'],
			titles: ['.faq__item__title']
		})

		this.elements.titles.forEach((title) => title.addEventListener('click', this.#handleClick))
	}

	#handleClick = (e) => {
		let hadClass = false
		const item = e.currentTarget.parentElement
		const paragraph = query('.faq__item__content', item)
		if (hasClass(item, 'active')) hadClass = true

		// const index = Array.from(e.currentTarget.parentElement.parentElement.children).indexOf(
		// 	e.currentTarget.parentElement
		// )

		this.elements.items.forEach((el) => removeClass(el, 'active'))
		if (!hadClass) addClass(item, 'active')

		this.elements.content.forEach((content) => setProps(content, { 'max-height': `0px` }))
		if (!hadClass) setProps(paragraph, { 'max-height': `${paragraph.scrollHeight}px` })
	}
}

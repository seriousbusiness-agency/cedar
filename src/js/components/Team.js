import { Component } from '@common/components'
import { query, hasClass, removeClass, addClass, setProps, toggleClass } from '@common/util/function'

export default class Team extends Component {
	doStart = () => {
		this.queryChildren({
			filtersItems: ['.team__filters__item'],
			items: ['.team__item'],
			content: ['.team__item__content'],
			filters: '.team__filters'
		})

		this.filters = []

		this.elements.filtersItems.forEach((item) => {
			item.addEventListener('click', this.#filter)
		})
		this.elements.items.forEach((item) => {
			item.addEventListener('click', this.#toggleAccordion)
		})
		this.elements.filters.addEventListener('click', this.#toggleFilters)
	}

	#toggleFilters = () => {
		toggleClass(this.elements.filters, 'active')
	}

	#filter = (e) => {
		const input = query('input', e.currentTarget)
		const name = input.getAttribute('name')
		if (input.checked && !this.filters.includes(name)) {
			this.filters.push(name)
		} else if (!input.checked && this.filters.includes(name)) {
			this.filters.splice(this.filters.indexOf(name), 1)
		}

		this.elements.items.forEach((item) => {
			const filter = item.getAttribute('data-filter')
			if (this.filters.includes(filter)) {
				item.classList.remove('hide')
			} else {
				item.classList.add('hide')
			}

			if (this.filters.length === 0) {
				item.classList.remove('hide')
			}
		})
	}

	#toggleAccordion = (e) => {
		const index = Array.from(e.currentTarget.parentElement.children).indexOf(e.currentTarget)

		this.elements.content.forEach((content) => setProps(content, { 'max-height': `0px` }))

		if (hasClass(e.currentTarget, 'active')) {
			this.elements.items.forEach((item) => removeClass(item, 'active'))
			return
		}

		setProps(this.elements.content[index], { 'max-height': `${this.elements.content[index].scrollHeight}px` })
		this.elements.items.forEach((item) => removeClass(item, 'active'))
		addClass(e.currentTarget, 'active')
	}
}

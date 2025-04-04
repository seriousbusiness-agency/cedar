import { Component } from '@common/components'
import { query, hasClass, removeClass, addClass, setProps, toggleClass } from '@common/util/function'

export default class Careers extends Component {
	doStart = () => {
		this.queryChildren({
			filtersItems: ['.careers__filters__item'],
			items: ['.careers__item'],
			content: ['.careers__item__content'],
			filters: '.careers__filters'
		})

		this.filters = {
			locations: [],
			functions: []
		}

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

		if (input.checked && !this.filters.locations.includes(name) && !this.filters.functions.includes(name)) {
			if (input.hasAttribute('data-filter-location')) {
				this.filters.locations.push(name)
			} else if (input.hasAttribute('data-filter-function')) {
				this.filters.functions.push(name)
			}
		} else if (!input.checked && (this.filters.locations.includes(name) || this.filters.functions.includes(name))) {
			if (input.hasAttribute('data-filter-location')) {
				this.filters.locations.splice(this.filters.locations.indexOf(name), 1)
			} else if (input.hasAttribute('data-filter-function')) {
				this.filters.functions.splice(this.filters.functions.indexOf(name), 1)
			}
		}

		this.elements.items.forEach((item) => {
			const locations = item.getAttribute('data-filter-location').split(',')
			const func = item.getAttribute('data-filter-function')

			if (
				locations.some((location) => this.filters.locations.includes(location)) &&
				(this.filters.functions.includes(func) || this.filters.functions.length === 0)
			) {
				removeClass(item, 'hide')
			} else if (this.filters.functions.includes(func) && this.filters.locations.length === 0) {
				removeClass(item, 'hide')
			} else {
				addClass(item, 'hide')
			}

			if (this.filters.locations.length === 0 && this.filters.functions.length === 0) {
				removeClass(item, 'hide')
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

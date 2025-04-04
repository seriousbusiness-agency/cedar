import { Component } from '@common/components'
import { query, hasClass, removeClass, addClass, toggleClass } from '@common/util/function'

export default class PartnersCards extends Component {
	doStart = () => {
		this.queryChildren({
			filtersItems: ['.partners-cards__filters__item'],
			items: ['.partners-cards__item'],
			filters: '.partners-cards__filters'
		})

		this.filters = {
			types: [],
			locations: []
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
		console.log('teste')
		const input = query('input', e.currentTarget)
		const name = input.getAttribute('name')

		if (input.checked && !this.filters.locations.includes(name) && !this.filters.types.includes(name)) {
			if (input.hasAttribute('data-filter-location')) {
				this.filters.locations.push(name)
			} else if (input.hasAttribute('data-filter-type')) {
				this.filters.types.push(name)
			}
		} else if (!input.checked && (this.filters.locations.includes(name) || this.filters.types.includes(name))) {
			if (input.hasAttribute('data-filter-location')) {
				this.filters.locations.splice(this.filters.locations.indexOf(name), 1)
			} else if (input.hasAttribute('data-filter-type')) {
				this.filters.types.splice(this.filters.types.indexOf(name), 1)
			}
		}

		this.elements.items.forEach((item) => {
			const location = item.getAttribute('data-filter-location')
			const func = item.getAttribute('data-filter-type')

			if (
				this.filters.locations.includes(location) &&
				(this.filters.types.includes(func) || this.filters.types.length === 0)
			) {
				removeClass(item, 'hide')
			} else if (this.filters.types.includes(func) && this.filters.locations.length === 0) {
				removeClass(item, 'hide')
			} else {
				addClass(item, 'hide')
			}

			if (this.filters.locations.length === 0 && this.filters.types.length === 0) {
				removeClass(item, 'hide')
			}
		})
	}

	#toggleAccordion = (e) => {
		if (hasClass(e.currentTarget, 'active')) {
			this.elements.items.forEach((item) => removeClass(item, 'active'))
			return
		}

		this.elements.items.forEach((item) => removeClass(item, 'active'))
		addClass(e.currentTarget, 'active')
	}
}

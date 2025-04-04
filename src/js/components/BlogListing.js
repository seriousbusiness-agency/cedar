import { Component } from '@common/components'
import { query, hasClass, removeClass, addClass, setProps, toggleClass } from '@common/util/function'

export default class BlogListing extends Component {
	doStart = () => {
		this.queryChildren({
			filtersItems: ['.blog-listing__filter'],
			items: ['.blog-listing__post'],
			filters: '.blog-listing__filters',
			searchInput: '#searchInput'
		})

		this.filters = []

		this.elements.filtersItems.forEach((item) => {
			item.addEventListener('click', this.#filter)
		})
		// Remove unnecessary event listeners
		this.elements.filters.addEventListener('click', this.#toggleFilters)

		// Add search functionality if needed
		if (this.elements.searchInput) {
			this.elements.searchInput.addEventListener('input', this.#handleSearch)
		}
	}

	#toggleFilters = () => {
		toggleClass(this.elements.filters, 'active')
	}

	#filter = (e) => {
		const filter = e.currentTarget.getAttribute('data-filter')

		// Remove active class from all filters
		this.elements.filtersItems.forEach((item) => {
			removeClass(item, 'active')
		})

		// Add active class to clicked filter
		addClass(e.currentTarget, 'active')

		// Clear filters array and add new filter
		this.filters = []
		if (filter !== 'all') {
			this.filters.push(filter)
		}

		// Show/hide items based on filter
		this.elements.items.forEach((item) => {
			const itemCategory = item.getAttribute('data-category')
			const itemProduct = item.getAttribute('data-product')

			if (
				this.filters.length === 0 ||
				itemCategory.includes(this.filters[0]) ||
				itemProduct.includes(this.filters[0])
			) {
				removeClass(item, 'hide')
			} else {
				addClass(item, 'hide')
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

	#handleSearch = (e) => {
		const searchTerm = e.target.value.toLowerCase()

		this.elements.items.forEach((item) => {
			const title = item.querySelector('.blog-listing__post__title').textContent.toLowerCase()

			if (title.includes(searchTerm)) {
				removeClass(item, 'hide')
			} else {
				addClass(item, 'hide')
			}
		})
	}
}

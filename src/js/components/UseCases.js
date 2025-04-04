import { Component } from '@common/components'
import { query, removeClass, addClass, toggleClass } from '@common/util/function'

export default class UseCases extends Component {
	doStart = () => {
		this.queryChildren({
			filtersItems: ['.use-cases__filters__item'],
			items: ['.use-cases__item'],
			content: ['.use-cases__item__content'],
			filters: '.use-cases__filters'
		})

		this.filters = {
			products: [],
			industries: [],
			partners: []
		}

		this.elements.filtersItems.forEach((item) => {
			item.addEventListener('click', this.#filter)
		})

		this.elements.filters.addEventListener('click', this.#toggleFilters)
	}

	#toggleFilters = () => {
		toggleClass(this.elements.filters, 'active')
	}

	#filter = (e) => {
		const input = query('input', e.currentTarget)
		const slug = input.getAttribute('name')

		if (input.checked) {
			if (input.hasAttribute('data-filter-product')) {
				this.filters.products.push(slug)
			} else if (input.hasAttribute('data-filter-industry')) {
				this.filters.industries.push(slug)
			} else if (input.hasAttribute('data-filter-partner')) {
				this.filters.partners.push(slug)
			}
		} else if (input.hasAttribute('data-filter-product')) {
			this.filters.products = this.filters.products.filter((item) => item !== slug)
		} else if (input.hasAttribute('data-filter-industry')) {
			this.filters.industries = this.filters.industries.filter((item) => item !== slug)
		} else if (input.hasAttribute('data-filter-partner')) {
			this.filters.partners = this.filters.partners.filter((item) => item !== slug)
		}

		this.elements.items.forEach((item) => {
			const productSlugs =
				item
					.getAttribute('data-filter-product')
					?.split(',')
					.map((s) => s.trim()) || []
			const industrySlugs =
				item
					.getAttribute('data-filter-industry')
					?.split(',')
					.map((s) => s.trim()) || []
			const partnerSlugs =
				item
					.getAttribute('data-filter-partner')
					?.split(',')
					.map((s) => s.trim()) || []

			const hasMatchingProduct =
				this.filters.products.length === 0 || productSlugs.some((itemSlug) => this.filters.products.includes(itemSlug))
			const hasMatchingIndustry =
				this.filters.industries.length === 0 ||
				industrySlugs.some((itemSlug) => this.filters.industries.includes(itemSlug))
			const hasMatchingPartner =
				this.filters.partners.length === 0 || partnerSlugs.some((itemSlug) => this.filters.partners.includes(itemSlug))

			if (hasMatchingProduct && hasMatchingIndustry && hasMatchingPartner) {
				removeClass(item, 'hide')
			} else {
				addClass(item, 'hide')
			}
		})
	}
}

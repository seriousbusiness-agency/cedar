import { Component } from '@common/components'
import { addClass, queryAll, removeClass } from '@common/util/function'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default class Features extends Component {
	doStart = () => {
		this.elements = queryAll({
			timeline: '.features__timeline',
			timelineItems: ['.features__timeline__item'],
			itemsWrapper: '.features__items-wrapper',
			items: ['.features__item']
		})

		this.elements.items.forEach((item, index) => {
			ScrollTrigger.create({
				trigger: item,
				start: 'top center',
				end: 'bottom 40%',
				onEnter: () => {
					this.elements.timelineItems.forEach((timelineItem) => {
						removeClass(timelineItem, 'active')
					})

					addClass(this.elements.timelineItems[index], 'active')
				},
				onEnterBack: () => {
					this.elements.timelineItems.forEach((timelineItem) => {
						removeClass(timelineItem, 'active')
					})

					addClass(this.elements.timelineItems[index], 'active')
				}
			})
		})
	}
}

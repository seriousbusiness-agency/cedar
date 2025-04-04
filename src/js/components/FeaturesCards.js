import { Component } from '@common/components'
import { getRect } from '@common/util/function'

export default class FeaturesCards extends Component {
	doStart = () => {
		this.queryChildren({
			paragraphs: ['.features-cards__card__paragraph']
		})
	}

	#fixHeights = () => {
		console.log(222)
		this.elements.paragraphs.forEach((paragraph) => {
			// set each paragraph's height equal to the tallest one in the group
			const height = Math.max(...this.elements.paragraphs.map((el) => getRect(el).height))
			paragraph.style.height = `${height}px`
		})
	}

	didResize = () => {
		this.elements.paragraphs.forEach((paragraph) => {
			paragraph.style.height = ''
		})
		this.#fixHeights()
	}
}

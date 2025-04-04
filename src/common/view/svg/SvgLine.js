import { createElementNS } from '@common/util/function'
import AbstractBox from '../abstract/AbstractBox'

export default class SvgLine extends AbstractBox {
	path = createElementNS('path')

	$points = [
		{ x: 0, y: 0 },
		{ x: 0.5, y: 0 },
		{ x: 0.5, y: 0 },
		{ x: 1, y: 0 }
	]

	constructor(id, props = { width: 500, height: 0, pivot: null, points: null }) {
		super()
		this.$maxWidth = this.$width = props.width
		this.$maxHeight = this.$height = props.height
		this.$pivot = props.pivot || this.$pivot
		this.$points = props.points || this.points
		this.id = id
		this.path.id = id || ''
		this.update()
	}

	update() {
		const points = this.$points.map((point) => {
			return { ...point }
		})

		const width = this.$width * this.$scaleX
		const height = this.$height * this.$scaleY
		const difX = (this.$maxWidth - width) * this.pivot.x
		const difY = (this.$maxHeight - height) * this.pivot.y

		let d = ''
		let j = -1
		points.forEach((point, i) => {
			d += !i ? 'M' : ''
			if (!j) {
				d += ` C`
				j = -3
			}
			d += ` ${point.x * width + difX} ${point.y * height + difY}`
			j++
		})
		this.d = d
		this.path.setAttribute('d', this.d)
	}
}

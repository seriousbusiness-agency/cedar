import AbstractBox from './AbstractBox'

export default class Box extends AbstractBox {
	$points = [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: 1 }
	]

	constructor(props = { width: 500, height: 500, pivot: null, points: null }) {
		super()
		this.$maxWidth = this.$width = props.width
		this.$maxHeight = this.$height = props.height
		this.$pivot = props.pivot || this.$pivot
		this.$points = props.points || this.points
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
		points.forEach((point, i) => {
			d += !i ? ' M' : ''
			d += ` ${point.x * width + difX} ${point.y * height + difY}`
		})
		d += ` ${points[0].x * width + difX} ${points[0].y * height + difY}`

		this.d = d
	}
}

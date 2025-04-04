import AbstractBox from './AbstractBox'

export default class RoundedBox extends AbstractBox {
	$radius
	$points = [
		{ x: 0, y: 0 },
		{ x: 0.25, y: 0 },
		{ x: 0.75, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: 0.25 },
		{ x: 1, y: 0.75 },
		{ x: 1, y: 1 },
		{ x: 0.75, y: 1 },
		{ x: 0.25, y: 1 },
		{ x: 0, y: 1 },
		{ x: 0, y: 0.75 },
		{ x: 0, y: 0.25 }
	]

	constructor(props = { width: 500, height: 500, radius: 0, pivot: null, points: null }) {
		super()
		this.$maxWidth = this.$width = props.width
		this.$maxHeight = this.$height = props.height
		this.$radius = props.radius
		this.$pivot = props.pivot || this.$pivot
		this.$points = props.points || this.$points
		this.update()
	}

	set radius(value) {
		if (value !== this.$radius) {
			this.$radius = value
			this.update()
		}
	}

	get radius() {
		return this.$radius
	}

	update() {
		const radius = this.$radius
		const width = this.$width * this.$scaleX
		const height = this.$height * this.$scaleY
		const points = this.$points.map((point) => {
			return { ...point }
		})

		const difX = (this.$maxWidth - width) * this.pivot.x
		const difY = (this.$maxHeight - height) * this.pivot.y

		points[1].y -= radius
		points[2].y -= radius
		points[4].x += radius
		points[5].x += radius
		points[7].y += radius
		points[8].y += radius
		points[10].x -= radius
		points[11].x -= radius

		let d = ''
		points.forEach((point, i) => {
			if (!i || !((i - 1) % 3)) d += !i ? ' M' : ' C'
			d += ` ${point.x * width + difX} ${point.y * height + difY}`
		})
		d += ` ${points[0].x * width + difX} ${points[0].y * height + difY}`

		this.d = d
	}
}

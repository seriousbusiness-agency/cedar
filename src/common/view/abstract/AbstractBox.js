export default class AbstractBox {
	d
	$scaleX = 1
	$scaleY = 1
	$maxWidth = 500
	$maxHeight = 500
	$width = 500
	$height = 500
	$pivot = {
		x: 0,
		y: 0
	}
	$points

	set pivot(value) {
		if (value !== this.$pivot) {
			this.$pivot = value
			this.update()
		}
	}

	get pivot() {
		return this.$pivot
	}

	set points(value) {
		if (value !== this.$points) {
			this.$points = value
			this.update()
		}
	}

	get points() {
		return this.$points
	}

	set maxWidth(value) {
		if (value !== this.$maxWidth) {
			this.$maxWidth = value
			this.update()
		}
	}

	get maxWidth() {
		return this.$maxWidth
	}

	set width(value) {
		if (value !== this.$width) {
			this.$width = value
			this.update()
		}
	}

	get width() {
		return this.$width
	}

	set maxHeight(value) {
		if (value !== this.$maxHeight) {
			this.$maxHeight = value
			this.update()
		}
	}

	get maxHeight() {
		return this.$maxHeight
	}

	set height(value) {
		if (value !== this.$height) {
			this.$height = value
			this.update()
		}
	}

	get height() {
		return this.$height
	}

	set scaleX(value) {
		if (value !== this.$scaleX) {
			this.$scaleX = value
			this.update()
		}
	}

	get scaleX() {
		return this.$scaleX
	}

	set scaleY(value) {
		if (value !== this.$scaleY) {
			this.$scaleY = value
			this.update()
		}
	}

	get scaleY() {
		return this.$scaleY
	}
}

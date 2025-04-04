import { createElementNS } from '@common/util/function'
import RoundedBox from '../abstract/RoundedBox'

export default class SvgRoundedBox extends RoundedBox {
	path = createElementNS('path')

	constructor(id, props = { width: 500, height: 500, radius: 0, pivot: null, points: null }) {
		super(props)
		this.id = id
		this.path.id = id || ''
		this.update()
	}

	update = () => {
		super.update()
		if (this.path) this.path.setAttribute('d', this.d)
	}
}

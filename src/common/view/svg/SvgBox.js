import { createElementNS } from '@common/util/function'
import Box from '../abstract/Box'

export default class SvgBox extends Box {
	path = createElementNS('path')

	constructor(id, props = { width: 500, height: 500, pivot: null, points: null }) {
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

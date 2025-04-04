import { setProps } from '@common/util/function'
import Box from '../abstract/Box'

export default class BoxMask extends Box {
	el

	constructor(el, props = { width: 500, height: 500, pivot: null, points: null }) {
		super(props)
		this.el = el
		setProps(this.el, { 'clip-path': `path(var(--d))` })
		this.update()
	}

	update = () => {
		super.update()
		if (this.el) setProps(this.el, { '--d': `"${this.d}"` })
	}
}

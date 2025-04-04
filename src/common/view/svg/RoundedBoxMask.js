import { setProps } from '../../util/function'
import RoundedBox from '../abstract/RoundedBox'

export default class RoundedBoxMask extends RoundedBox {
	constructor(el, props = { width: 500, height: 500, radius: 0, pivot: null, points: null }) {
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

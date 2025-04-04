import { query } from '@common/util/function'
import Component from './Component'
import Components from './Components'

export default class Page extends Component {
	id
	isReady = true
	isInteractable = true

	constructor(element) {
		super(element)
		this.once('dispose', () => {
			this.didOutView()
			this.#disposeComponents()
		})
	}

	doUpdate = () => {}

	prepare = () => {}

	cancelPrepare = () => {}

	ready = () => {
		if (!this.isReady) {
			this.isReady = true
			this.emit('ready')
		}
	}

	didCancelPrepare = () => {
		this.emit('cancel_prepare')
	}

	#disposeComponents = () => {
		console.log(`disposing ${this.id} page components`)
		Components.dispose(query('main', this.element) || this.element)
	}
}

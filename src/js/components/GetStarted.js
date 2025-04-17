import { Component } from '@common/components'
import { queryAll } from '@common/util/function'

export default class GetStarted extends Component {
	doStart = () => {
		this.elements = queryAll({})
	}
}

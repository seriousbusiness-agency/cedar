import Page from '@common/components/Page'

export default class Homepage extends Page {
	doStart = () => {
		this.queryChildren({})
	}
}

import Page from '@common/components/Page'

export default class Contact extends Page {
	doStart = () => {
		this.#createForms()
	}

	#createForms = () => {
		const baseURLWithoutFormatting = window.location.href
		const isGerman = baseURLWithoutFormatting.includes('/de')
		const isEnglish = !isGerman

		if (isGerman) {
			hbspt.forms.create({
				region: 'na1',
				portalId: '9285973',
				formId: 'd7aa9837-91b1-4c76-b553-c0bd94b3f975',
				target: '.form',
				cssClass: 'hs-form-frame'
			})
		}
		if (isEnglish) {
			hbspt.forms.create({
				region: 'na1',
				portalId: '9285973',
				formId: 'f2eb5724-2b37-40e5-b24d-8935051613b4',
				target: '.form',
				cssClass: 'hs-form-frame'
			})
		}
	}
}

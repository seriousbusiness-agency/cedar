import { Component } from '@common/components'
import { addClass, addEventListeners, each, query, queryAll, removeClass, validateInput } from '@common/util/function'
import gsap from 'gsap/all'
import datepicker from 'js-datepicker'

export default class Form extends Component {
	#stepIndex = 0

	doStart = () => {
		this.queryChildren({
			stepsWrapper: '.form__steps-wrapper',
			steps: ['.form__step'],
			submit: '.form__submit',
			backBt: ['.form__back'],
			nextBt: ['.form__next'],
			datepicker: ['.form__datepicker']
		})

		this.elements.submit.addEventListener('click', this.#submit)
		addEventListeners(this.elements.backBt, 'click', this.#backHandler)
		addEventListeners(this.elements.nextBt, 'click', this.#nextHandler)


		each(this.elements.datepicker, (el) => {
			const picker = datepicker(el, { alwaysShow : true, noWeekends: true, showAllDates: true, startDate: new Date(), minDate: new Date() })
		})
	}

	#backHandler = () => {
		this.#stepIndex--
		this.#gotoStep()
	}

	#nextHandler = () => {
		if (this.#validateInputs()) {
			this.#stepIndex++
			this.#gotoStep()
		}
	}

	#gotoStep = () => {
		addClass(this.element, 'disable')
		gsap.to(this.elements.stepsWrapper, {
			xPercent: -100 * this.#stepIndex,
			duration: 0.75,
			ease: 'Quart.easeInOut',
			onComplete: () => {
				removeClass(this.element, 'disable')
			}
		})
	}

	#showMessage = (message) => {
		const currentStep = this.elements.steps[this.#stepIndex]
		const statusEl = query('.form__status', currentStep)

		gsap.killTweensOf(statusEl)
		gsap.to(statusEl, {
			opacity: 0,
			duration: statusEl.innerHTML !== '&nbsp;' ? 0.35 : 0,
			ease: 'Quad.easeInOut',
			onComplete: () => {
				statusEl.innerHTML = message

				gsap.to(statusEl, {
					opacity: 1,
					duration: 0.35,
					ease: 'Quad.easeInOut'
				})
			}
		})
	}

	#validateInputs = () => {
		const currentStep = this.elements.steps[this.#stepIndex]
		const inputs = queryAll('input,textarea', currentStep)

		let isValid = true

		each(inputs, (input) => {
			removeClass(input.parentNode, 'error')

			if (!validateInput(input).valid) {
				isValid = false
				addClass(input.parentNode, 'error')
			}
		})

		if (!isValid) this.#showMessage('Fill in the fields properly.')

		return isValid
	}

	#submit = (e) => {
		e.preventDefault()

		if (this.#validateInputs()) {
			addClass(this.element, 'disable')
			this.#showMessage('sending')

			const inputs = queryAll('input,textarea', this.element)

			const formData = new FormData(this.element)
			formData.append('action', 'fetch')

			fetch(window.location.href, {
				method: 'POST',
				body: formData
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`)
					}
					return response.json()
				})
				.then((response) => {
					console.log(response)
					if (response.result) {
						if(this.#stepIndex) {
							this.#showMessage('&nbsp;')
							this.#stepIndex = 0
							this.#gotoStep()
						}

						this.#showMessage('Sent successfully!')
						removeClass(this.element, 'disable')
						each(inputs, (input) => {
							input.value = ''
						})
					} else {
						this.#showMessage('There was an unexpected error, please try again.')
						removeClass(this.element, 'disable')
					}
				})
				.catch(() => {
					this.#showMessage('There was an unexpected error, please try again.')
					removeClass(this.element, 'disable')
				})
		}

		return false
	}
}

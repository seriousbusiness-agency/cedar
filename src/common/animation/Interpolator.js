import { cancelLimitedAnimationFrame, limitedRequestAnimationFrame } from '@common/animation/tick'
import { each } from '@common/util/function'
import EventEmitter from 'events'

let id = 0

class Interpolator extends EventEmitter {
	requestId
	inertia
	friction
	precision
	value
	targetValue
	distValue
	length
	running = false
	paused = true
	#baseMs

	constructor(startValue = [0], props = { inertia: 0.075, friction: 0, precision: 0.001, baseFps: 60 }) {
		super()
		this.requestId = Date.now() + ++id
		this.value = [...startValue]
		this.targetValue = [...startValue]
		this.length = startValue.length
		this.distValue = Array(this.length).fill(0)

		this.inertia = props.inertia
		this.friction = props.friction
		this.precision = props.precision
		this.#baseMs = 1000 / props.baseFps
	}

	set = (value = [0], force = false) => {
		if (value.length !== this.length)
			throw new Error('The set value has a different length than the initialization value.')
		this.targetValue = value
		// console.log('Interpolator:set')
		if (force) {
			// console.log('Interpolator:set->immediate', this.value)
			cancelLimitedAnimationFrame(this.requestId)
			this.value = [...this.targetValue]
			this.running = false
			this.#dispatchEvent('update', this.onUpdate, { force: true })
			this.#dispatchEvent('complete', this.onComplete, { force: true })
		} else if (!this.running && !this.paused && this.#canRun()) this.#update()
	}

	pause = () => {
		this.paused = true
		this.running = false
		cancelLimitedAnimationFrame(this.requestId)
		this.#dispatchEvent('pause', this.onPause)
	}

	resume = (ignoreLastValue) => {
		if (ignoreLastValue) {
			this.targetValue = [...this.value]
			this.distValue = [...this.value]
		}
		this.paused = false
		this.#dispatchEvent('resume', this.onResume)
		if (this.#canRun()) this.#update()
	}

	#canRun = () => {
		let canRun = false
		for (let i = 0; i < this.length; i++) {
			if (this.targetValue[i] !== this.value[i]) {
				canRun = true
				break
			}
		}
		return !this.running && canRun
	}

	#dispatchEvent = (type, call, params = {}) => {
		if (call) call(this.value, params)
		this.emit(type, this.value, params)
	}

	#update = () => {
		if (!this.paused) {
			this.running = true
			// console.log('Interpolator:_update', this.value);
			let finished = 0
			// console.log(this.distValue)

			each(this.targetValue, (targetValue, i) => {
				if (!this.friction) this.distValue[i] = this.value[i]
				this.distValue[i] += (targetValue - this.value[i]) * this.inertia
				if (this.friction) {
					this.distValue[i] *= this.friction
					this.value[i] += this.distValue[i]
					if (Math.abs(this.distValue[i]) < this.precision) {
						this.value[i] = targetValue
						finished++
					}
				} else {
					if (Math.abs(targetValue - this.value[i]) < this.precision) {
						this.distValue[i] = targetValue
						finished++
					}
					this.value[i] = this.distValue[i]
				}
			})

			this.#dispatchEvent('update', this.onUpdate)
			if (finished === this.length) {
				this.running = false
				this.#dispatchEvent('complete', this.onComplete)
			} else limitedRequestAnimationFrame(this.requestId, this.#update, this.#baseMs)
		}
	}
}

export default Interpolator

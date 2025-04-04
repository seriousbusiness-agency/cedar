import { each, setProps } from '@common/util/function'

const ignore = ['ease', 'onStart', 'onUpdate', 'onComplete', 'delay', 'duration']
let targets = []
let request
let hideStartTime

const splitValue = (value) => {
	const numValue = parseFloat(value) || 0
	const unit = value.toString().replace(numValue.toString(), '') || 0
	return [numValue, unit]
}

document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') {
		const lapsedTime = Date.now() - hideStartTime
		each(targets, (obj) => {
			obj.time += lapsedTime
			obj.startTime += lapsedTime
		})
	} else hideStartTime = Date.now()
})

class Tween {
	/**
	 *
	 * @param {HTMLElement} target
	 * @param {Object} props
	 * @param {{ease:Function, onUpdate:Function, onStart:Function, onComplete:Function, delay:Number, duration:Number}} toProps
	 */
	static to = (target, toProps, fromProps) => {
		toProps.duration = Number.isFinite(toProps.duration) ? toProps.duration * 1000 : 500
		toProps.ease = toProps.ease || ((x) => x)
		toProps.delay = toProps.delay * 1000 || 0

		const isEl = target instanceof Element
		const now = Date.now()
		const entries = Object.entries(toProps).filter((entrie) => !ignore.includes(entrie[0]))
		each(entries, ([key]) => {
			toProps[key] = splitValue(toProps[key])
		})

		targets.push({
			target,
			isEl,
			toProps,
			fromProps,
			entries,
			time: now,
			startTime: now + toProps.delay
		})

		if (!request) Tween.render()
	}

	static fromTo = (target, fromProps, toProps) => {
		const keys = Object.keys(fromProps)
		each(keys, (key) => {
			const [value] = splitValue(fromProps[key])
			fromProps[key] = value
		})
		Tween.to(target, toProps, fromProps)
	}

	/**
	 *
	 * @param {HTMLElement} target
	 */
	static kill = (target) => {
		each(targets, (obj) => {
			const currentTarget = obj.target
			if (currentTarget === target) targets = targets.filter((currentObj) => currentObj !== obj)
		})
	}

	static render = () => {
		// console.log("running ...")

		each(targets, (obj, i) => {
			const { target } = obj
			const { isEl } = obj
			let { fromProps } = obj
			const { toProps } = obj
			const { entries } = obj
			const { duration } = toProps
			const { time } = obj
			const { startTime } = obj
			const now = Date.now()
			if (toProps.delay && now - time <= toProps.delay) return
			toProps.delay = 0
			const s = Math.min((now - startTime) / duration, 1)
			const props = isEl ? {} : target

			if (!obj.started) {
				// check if target is tweening and remove
				const otherInputs = targets.filter((a, b) => a.started && b !== i)

				each(otherInputs, (currentObj) => {
					if (currentObj.target === target) {
						each(entries, (currentEntry) => {
							each(currentObj.entries, (prevEntry, h) => {
								if (currentEntry[0] === prevEntry[0]) currentObj.entries.splice(h, 1)
							})
						})
					}
				})

				if (toProps.onStart) toProps.onStart(props, s)

				obj.started = true
			}

			if (!fromProps) {
				fromProps = {}

				each(entries, ([key]) => {
					const [value] = splitValue(isEl ? target.style.getPropertyValue(key) : target[key])
					fromProps[key] = value
				})

				obj.fromProps = fromProps
			}

			each(entries, ([key]) => {
				const fromVal = fromProps[key]
				const toVal = toProps[key][0]
				const unit = toProps[key][1]
				const newValue = fromVal + (toVal - fromVal) * toProps.ease(s) + unit
				if (isEl) setProps(target, { [key]: newValue })
				props[key] = newValue
			})

			if (toProps.onUpdate) toProps.onUpdate(props, s)
			if (s === 1) {
				targets = targets.filter((currentObj) => currentObj !== obj)
				if (toProps.onComplete) toProps.onComplete(obj)
			}
		})

		if (targets.length) request = requestAnimationFrame(Tween.render)
		else request = null
	}
}
export default Tween

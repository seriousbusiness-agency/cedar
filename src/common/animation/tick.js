const requestsDic = {}

const cancelLimitedAnimationFrame = (requestId) => {
	const obj = requestsDic[requestId]
	if (obj) {
		cancelAnimationFrame(obj.request)
		delete requestsDic[requestId]
	}
}
const limitedRequestAnimationFrame = (requestId, call /* ms = 1000 / 120, baseMs = 1000 / 60, msLimit = 0 */) => {
	const obj = requestsDic[requestId] || {}
	obj.request = requestAnimationFrame(() => {
		// const lastTime = obj.lastTime || 0;
		// const lapsed = lastTime ? (now - lastTime) : (msLimit || baseMs);
		// if (!lapsed || !baseMs) console.log(lapsed, baseMs)
		// if (!msLimit || lapsed >= msLimit) {
		// 	call(lapsed / baseMs);
		// 	obj.lastTime = now;
		// 	return;
		// }
		// limitedRequestAnimationFrame(requestId, call, baseMs, msLimit)
		call()
	})
	requestsDic[requestId] = obj
	return requestId
}

class Tick {
	paused = true

	request

	#ms

	#baseMs

	#lapsed = 0

	#lastUpdateTime = 0

	constructor(/* maxFps = 120, */ baseFps = 60) {
		// this.#ms = 1000 / maxFps;
		// this.#baseMs = 1000 / (baseFps || maxFps);
		this.#baseMs = 1000 / baseFps
	}

	start = () => {
		this.didStart()
		this.resume()
	}

	resume = () => {
		if (!this.paused) return
		console.log('Tick:resume()')
		this.paused = false
		cancelAnimationFrame(this.request)
		this.resize()
		this.#check()
		window.addEventListener('resize', this.resize)
		this.didResume()
	}

	pause = (immediately) => {
		console.log('Tick:pause()')
		this.#lastUpdateTime = 0
		if (!immediately) this.update()
		this.paused = true
		cancelAnimationFrame(this.request)
		window.removeEventListener('resize', this.resize)
		this.didPause()
	}

	setFPSLimit = () => {
		// this.#ms = maxFps ? (1000 / maxFps) : null;
	}

	update = () => {
		if (!this.paused) this.doUpdate(1 /* this.#lapsed / this.#baseMs */)
	}

	#check = (now = 0) => {
		this.request = requestAnimationFrame(this.#check)
		const lapsed = this.#lastUpdateTime ? now - this.#lastUpdateTime : this.#ms || this.#baseMs
		if (!this.#ms || lapsed >= this.#ms) {
			this.#lapsed = lapsed
			this.#lastUpdateTime = now
			this.update()
		}
	}

	didStart = () => {}

	didResume = () => {}

	didPause = () => {}

	doUpdate = () => {}

	resize = () => {}
}

export { Tick, cancelLimitedAnimationFrame, limitedRequestAnimationFrame }

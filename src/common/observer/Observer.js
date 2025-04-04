let running = true
const observers = {}
const intersectionHandler = (entries, observer) => {
	if (!running) return
	entries.forEach((entry) => {
		const el = entry.target
		if (!el.callbacks[observer.id]) return
		el.callbacks[observer.id].forEach((callback) => {
			callback(el, entry, observer)
		})
		// Each entry describes an intersection change for one observed
		// target element:
		//   entry.boundingClientRect
		//   entry.intersectionRatio
		//   entry.intersectionRect
		//   entry.isIntersecting
		//   entry.rootBounds
		//   entry.target
		//   entry.time
	})
}

export default class Observer {
	static create(id, options) {
		const observer = new window.IntersectionObserver(intersectionHandler, options)
		observer.id = id
		observers[id] = observer
	}

	static observe(id, elements, callback) {
		if (!observers[id]) throw new Error(`observer with id "${id}" does not exist`)
		elements = Array.isArray(elements) ? elements : [elements]
		elements.forEach((el) => {
			el.callbacks = el.callbacks || {}
			el.callbacks[id] = el.callbacks[id] || []
			if (!el.callbacks[id].includes(callback)) {
				el.callbacks[id].push(callback)
				observers[id].observe(el)
			}
		})
	}

	static unobserve(id, elements, callback) {
		elements = Array.isArray(elements) ? elements : [elements]
		elements.forEach((el) => {
			// delete element.observers;
			// element.observers = null;
			if (callback) {
				const callbacks = el.callbacks[id]
				const index = callbacks.indexOf(callback)
				if (index > -1) {
					callbacks.splice(index, 1)
					if (!callbacks.length) {
						el.callbacks[id] = null
						observers[id].unobserve(el)
					}
				}
			} else {
				el.callbacks[id] = null
				observers[id].unobserve(el)
			}
		})
	}

	static start = () => {
		running = true
	}

	static pause = () => {
		running = false
	}
}

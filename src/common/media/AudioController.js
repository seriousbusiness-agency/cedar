import { setAttributes } from '@common/util/function'
import { EventEmitter } from 'events'

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioCtx = new AudioContext()

const ignore = ['maxVolume']
const audios = window.audios || {}
window.audios = audios
window.audioCtx = audioCtx

export default class AudioController {
	static listener = new EventEmitter()

	static add(id, el, props = {}) {
		const copyProps = { ...props }
		ignore.forEach((key) => delete copyProps[key])
		setAttributes(el, copyProps)

		audios[id] = {
			el,
			maxVolume: props.maxVolume || 1,
			...copyProps
		}
	}

	static remove(id) {
		delete audios[id]
	}

	static get(id) {
		return audios[id]
	}

	static play(id) {
		const audio = audios[id]
		if (!audio.paused) {
			const promise = audio.el.play()
			if (promise !== undefined) {
				promise
					.then(() => {
						AudioController.#dispatchEvent('play', id)
					})
					.catch((e) => {
						AudioController.#dispatchEvent('error', id)
					})
			}
		}
	}

	static pause(id) {
		audios[id].el.pause()
		AudioController.#dispatchEvent('pause', id)
	}

	static isPlaying(id) {
		return !audios[id].el.paused
	}

	static pauseAll() {
		Object.entries(audios).forEach((id) => AudioController.pause(id))
		AudioController.#dispatchEvent('pause_all')
	}

	static volume(volume, ids) {
		ids = ids || Object.entries(audios)
		ids.forEach((id) => {
			const obj = audios[id]
			if (obj) {
				obj.el.volume = obj.maxVolume * volume
				AudioController.#dispatchEvent('volume', id)
			}
		})
	}

	static reset(ids) {
		ids = ids || Object.entries(audios)
		ids.forEach((id) => {
			const obj = audios[id]
			obj.el.currentTime = 0
			AudioController.#dispatchEvent('reset', id)
		})
	}

	static setup() {
		Object.entries(audios).forEach((id) => {
			AudioController.play(id)
			AudioController.pause(id)
		})
	}

	static #dispatchEvent(type, id) {
		this.listener.emit(type, id, audios[id])
	}
}

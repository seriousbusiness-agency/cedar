import { each, queryAll } from '@common/util/function'

const componentsDic = {}

export default class Components {
	/**
	 *
	 * @param {{id:ClassDefinition}} data
	 */
	static register(data) {
		const keys = Object.keys(data)
		each(keys, (key) => {
			const ClassDefinition = data[key]
			componentsDic[key] = ClassDefinition
		})
	}

	static scan(autoInit, root) {
		const components = queryAll('[data-component]', root)
		const instances = []
		each(components, (element) => {
			if (element.instance) return
			const className = element.getAttribute('data-component')
			const ClassDefinition = componentsDic[className]
			if (ClassDefinition) {
				const instance = new ClassDefinition(element)
				element.instance = instance
				instances.push(instance)
			}
		})

		each(instances, (instance) => {
			instance.doSetup()
			if (autoInit) instance.init()
		})
	}

	static init(root) {
		const components = queryAll('[data-component]', root)
		each(components, (element) => {
			if (element.instance) element.instance.init()
		})
	}

	static dispose(el) {
		console.log('Components::dispose()')
		const components = queryAll('[data-component]', el)
		each(components, (element) => {
			if (element.instance && element.instance.dispose) {
				element.instance.dispose()
				element.instance = null
			}
		})
	}
}

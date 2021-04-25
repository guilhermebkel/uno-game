import { Store } from "@/Protocols/StoreProtocol"

/**
 * This store is a in-memory async map data structure.
 * So, the data here is not supposed to be persisted.
 */
class AsyncMapStoreService<Model> implements Store<Model> {
	private store: Map<string, Model> = new Map()

	async set (id: string, data: Model): Promise<void> {
		this.store.set(id, data)
	}

	async delete (id: string): Promise<void> {
		this.store.delete(id)
	}

	async getOne (id: string): Promise<Model> {
		const model = this.store.get(id)

		return model
	}

	async getAll (): Promise<Model[]> {
		const models: Model[] = []

		for (const model of this.store.values()) {
			models.push(model)
		}

		return models
	}

	async getKeys (): Promise<string[]> {
		const keys: string[] = []

		for (const key of this.store.keys()) {
			keys.push(key)
		}

		return keys
	}
}

export default AsyncMapStoreService

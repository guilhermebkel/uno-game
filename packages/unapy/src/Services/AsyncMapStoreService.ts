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
		const models = Array.from(this.store, ([, value]) => value)

		return models
	}

	async getKeys (): Promise<string[]> {
		const keys = Array.from(this.store, ([key]) => key)

		return keys
	}

	set storeData (storeData: Map<string, Model>) {
		this.store = storeData
	}
}

export default AsyncMapStoreService

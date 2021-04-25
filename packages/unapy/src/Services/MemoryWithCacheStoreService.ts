import { Store } from "@/Protocols/StoreProtocol"

import RedisStoreService from "@/Services/RedisStoreService"
import FIFOQueueService from "@/Services/FIFOQueueService"

/**
 * This store is faster than Redis since it works on in-memory data structure
 * while making the data persisted since it schedules changes on redis everytime
 * that it is needed. It basically combines 'AsyncMapStore' with 'RedisStore'.
 */
class MemoryWithCacheStoreService<Model> implements Store<Model> {
	private store: Map<string, Model> = new Map()

	private redisStoreService: RedisStoreService<Model>
	private redisStoreActionFIFOQueue: FIFOQueueService
	private cacheLoaded = false

	constructor (namespace: string) {
		this.redisStoreService = new RedisStoreService(namespace)
		this.redisStoreActionFIFOQueue = new FIFOQueueService()
	}

	async set (id: string, data: Model): Promise<void> {
		await this.loadCacheIfNeeded()

		this.redisStoreActionFIFOQueue.enqueue(() => this.redisStoreService.set(id, data))

		this.store.set(id, data)
	}

	async delete (id: string): Promise<void> {
		await this.loadCacheIfNeeded()

		this.redisStoreActionFIFOQueue.enqueue(() => this.redisStoreService.delete(id))

		this.store.delete(id)
	}

	async getOne (id: string): Promise<Model> {
		await this.loadCacheIfNeeded()

		const model = this.store.get(id)

		return model
	}

	async getAll (): Promise<Model[]> {
		await this.loadCacheIfNeeded()

		const models: Model[] = []

		for (const model of this.store.values()) {
			models.push(model)
		}

		return models
	}

	async getKeys (): Promise<string[]> {
		await this.loadCacheIfNeeded()

		const keys: string[] = []

		for (const key of this.store.keys()) {
			keys.push(key)
		}

		return keys
	}

	private async loadCacheIfNeeded (): Promise<void> {
		if (!this.cacheLoaded) {
			const cachedData = await this.redisStoreService.getAllInMap()

			this.store = cachedData
			this.cacheLoaded = true
		}
	}
}

export default MemoryWithCacheStoreService

import { Store } from "@/Protocols/StoreProtocol"

import RedisStoreService from "@/Services/RedisStoreService"
import AsyncMapStoreService from "@/Services/AsyncMapStoreService"
import GlobalFIFOQueueService from "@/Services/GlobalFIFOQueueService"

/**
 * This store is faster than Redis since it works on in-memory data structure
 * while making the data persisted since it schedules changes on redis everytime
 * that it is needed. It basically combines 'AsyncMapStore' with 'RedisStore'.
 */
class MemoryWithCacheStoreService<Model> implements Store<Model> {
	private asyncMapStoreService: AsyncMapStoreService<Model>
	private redisStoreService: RedisStoreService<Model>
	private cacheLoaded: boolean

	constructor (namespace: string) {
		this.redisStoreService = new RedisStoreService(namespace)
		this.asyncMapStoreService = new AsyncMapStoreService()
		this.cacheLoaded = false
	}

	async set (id: string, data: Model): Promise<void> {
		await this.loadCacheIfNeeded()

		GlobalFIFOQueueService.enqueue(() => this.redisStoreService.set(id, data), id)

		await this.asyncMapStoreService.set(id, data)
	}

	async delete (id: string): Promise<void> {
		await this.loadCacheIfNeeded()

		GlobalFIFOQueueService.enqueue(() => this.redisStoreService.delete(id), id)

		await this.asyncMapStoreService.delete(id)
	}

	async getOne (id: string): Promise<Model> {
		await this.loadCacheIfNeeded()

		const model = await this.asyncMapStoreService.getOne(id)

		return model
	}

	async getAll (): Promise<Model[]> {
		await this.loadCacheIfNeeded()

		const models = await this.asyncMapStoreService.getAll()

		return models
	}

	async getKeys (): Promise<string[]> {
		await this.loadCacheIfNeeded()

		const keys: string[] = await this.asyncMapStoreService.getKeys()

		return keys
	}

	private async loadCacheIfNeeded (): Promise<void> {
		if (!this.cacheLoaded) {
			const cachedData = await this.redisStoreService.getAllInMap()

			this.asyncMapStoreService.storeData = cachedData
			this.cacheLoaded = true
		}
	}
}

export default MemoryWithCacheStoreService

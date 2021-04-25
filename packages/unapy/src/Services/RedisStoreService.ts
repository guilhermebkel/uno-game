import CacheService from "@/Services/CacheService"

import { Store } from "@/Protocols/StoreProtocol"

/**
 * This store is backed by Redis, so it is fast and supposed
 * to be persisted.
 */
class RedisStoreService<Model> implements Store<Model> {
	private namespace: string
	private separator = ":"

	constructor (namespace: string) {
		this.namespace = namespace
	}

	async set (id: string, data: Model): Promise<void> {
		const key = this.mountKey(id)

		await CacheService.set(
			key,
			data as Record<string, unknown>,
		)
	}

	async delete (id: string): Promise<void> {
		const key = this.mountKey(id)

		await CacheService.delete(key)
	}

	async getOne (id: string): Promise<Model> {
		const key = this.mountKey(id)

		const model = await CacheService.get(key)

		return model as Model
	}

	async getAll (): Promise<Model[]> {
		const models: Model[] = []

		const cacheKeys = await this.getAllCacheKeys()

		await Promise.all(
			cacheKeys.map(async cacheKey => {
				const model = await CacheService.get(cacheKey) as Model

				models.push(model)
			}),
		)

		return models
	}

	async getKeys (): Promise<string[]> {
		const cacheKeys = await this.getAllCacheKeys()

		const keys = cacheKeys.map(cacheKey => {
			const [, key] = cacheKey.split(this.separator)

			return key
		})

		return keys
	}

	async getAllInMap (): Promise<Map<string, Model>> {
		const modelMap = new Map<string, Model>()

		const cacheKeys = await this.getAllCacheKeys()

		await Promise.all(
			cacheKeys.map(async cacheKey => {
				const [, key] = cacheKey.split(this.separator)

				const model = await CacheService.get(cacheKey) as Model

				modelMap.set(key, model)
			}),
		)

		return modelMap
	}

	private mountKey (modelId: string): string {
		const key = `${this.namespace}${this.separator}${modelId}`

		return key
	}

	private async getAllCacheKeys (): Promise<string[]> {
		const wildCardKey = this.mountKey("*")

		const cacheKeys = await CacheService.getKeysByPattern(wildCardKey)

		return cacheKeys
	}
}

export default RedisStoreService

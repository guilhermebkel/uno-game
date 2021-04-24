import CacheService from "@/Services/CacheService"

import { Store } from "@/Protocols/StoreProtocol"

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

	async getAllCacheKeys (): Promise<string[]> {
		const wildCardKey = this.mountKey("*")

		const cacheKeys = await CacheService.getKeysByPattern(wildCardKey)

		return cacheKeys
	}

	async getKeys (): Promise<string[]> {
		const cacheKeys = await this.getAllCacheKeys()

		const keys = cacheKeys.map(cacheKey => {
			const [, key] = cacheKey.split(this.separator)

			return key
		})

		return keys
	}

	private mountKey (modelId: string): string {
		const key = `${this.namespace}${this.separator}${modelId}`

		return key
	}
}

export default RedisStoreService

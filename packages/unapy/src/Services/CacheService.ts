import Redis, { Redis as RedisInterface } from "ioredis"

import redisConfig from "@/Config/redis"

class CacheService {
	redis: RedisInterface

	constructor () {
		const redisPort = Number(redisConfig.port)

		this.redis = new Redis(redisPort, redisConfig.host, {
			password: redisConfig.password,
		})
	}

	async getKeysByPattern (pattern: string): Promise<string[]> {
		const keys = await new Promise<string[]>((resolve, reject) => {
			this.redis.keys(pattern, (error, keys) => {
				if (error) {
					reject(error)
				}

				resolve(keys)
			})
		})

		return keys
	}

	async get<ExpectedData extends Record<string, unknown>> (key: string): Promise<ExpectedData> {
		const cached = await this.redis.get(key)

		if (cached) {
			return JSON.parse(cached)
		} else {
			return null
		}
	}

	async set<ExpectedData extends Record<string, unknown>> (
		key: string,
		value: ExpectedData,
		expiration: number = null,
	): Promise<boolean> {
		const payload = JSON.stringify(value)

		if (expiration) {
			return Boolean(await this.redis.set(key, payload, "EX", expiration))
		} else {
			return Boolean(await this.redis.set(key, payload))
		}
	}

	async delete (key: string): Promise<boolean> {
		const isKeyDeleted = await this.redis.del(key)

		if (isKeyDeleted) {
			return true
		} else {
			return false
		}
	}
}

export default new CacheService()

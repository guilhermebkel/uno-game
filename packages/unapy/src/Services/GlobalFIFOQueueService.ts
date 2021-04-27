import FIFOQueueService from "@/Services/FIFOQueueService"

class GlobalFIFOQueueService {
	private static readonly queues: Map<string, FIFOQueueService> = new Map()

	static async enqueue<ExpectedResult extends unknown> (
		fn: () => Promise<ExpectedResult> | ExpectedResult,
		contextId: string,
	): Promise<ExpectedResult> {
		let queue = this.queues.get(contextId)

		if (!queue) {
			queue = new FIFOQueueService()

			this.queues.set(contextId, queue)
		}

		return await queue.enqueue(fn)
	}

	static purge (contextId: string): void {
		const queue = this.queues.get(contextId)

		if (queue) {
			queue.purge()
			this.queues.delete(contextId)
		}
	}
}

export default GlobalFIFOQueueService

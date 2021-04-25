import PQueue from "p-queue"

class FIFOQueueService {
	private readonly queue: PQueue

	constructor () {
		const defaultOptions = {
			concurrency: 1,
		}

		this.queue = new PQueue(defaultOptions)
	}

	async enqueue<ExpectedResult extends unknown> (
		fn: () => Promise<ExpectedResult> | ExpectedResult,
	): Promise<ExpectedResult> {
		return await this.queue.add(fn)
	}

	purge (): void {
		this.queue.clear()
	}
}

export default FIFOQueueService

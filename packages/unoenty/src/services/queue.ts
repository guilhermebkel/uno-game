type QueueOptions = {
	concurrency: number
	retries: number
	delay: number
}

type QueuePayload = {
	metadata: {
		jobId: number
		error: string | null
		retries: number
	}
}

class Queue {
	payload: Array<object & QueuePayload> = []

	options: QueueOptions

	worker: (payload: any) => Promise<void>

	queueRefreshTime = 100

	enqueued = 0

	constructor(worker: (payload: any) => Promise<void>, options: QueueOptions) {
		this.worker = worker

		this.options = options
	}

	addPayload(payload: Array<object> | object) {
		if (Array.isArray(payload)) {
			this.payload = payload as QueuePayload[]
		} else {
			this.payload.push(payload as QueuePayload)
		}
	}

	async process() {
		if (!this.payload.length) {
			return
		}
	
		this.setMetadata()
	
		await new Promise((callback) => {
			const checkQueue = setInterval(() => {
				if (this.enqueued < this.options.concurrency && this.payload.length > 0) {
					this.initWorker()
				} else if (this.enqueued === 0) {
					clearInterval(checkQueue)
					callback()
				}
			}, this.queueRefreshTime)
		})
	}

	get info() {
		return {
			...this.options,
			payload: this.payload
		}
	}

	kill() {
		this.payload.length = 0
	}

	private async initWorker() {
		const payloadOnProcess = this.payload.shift()

		if (payloadOnProcess) {
			this.enqueued++
	
			try {
				if (payloadOnProcess?.metadata?.retries <= this.options.retries) {
					await this.worker(payloadOnProcess)
				}
			} catch (error) {
				if (this.options.retries && payloadOnProcess.metadata.retries < this.options.retries) {
					payloadOnProcess.metadata.retries++
					payloadOnProcess.metadata.error = error
		
					this.addPayload(payloadOnProcess)
		
					await this.delay(this.options.delay)
				}
	
				console.error(error)
			}
		
			this.enqueued--
		}
	}

	private setMetadata() {
		this.payload = this.payload.map((payload, index) => ({
			...payload,
			metadata: {
				jobId: index,
				error: null,
				retries: 0
			}
		}))
	}

	private async delay(milliseconds: number) {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
}

export default Queue
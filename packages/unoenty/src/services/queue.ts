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

class Queue<TPlayload> {
	payload: (TPlayload & QueuePayload)[] = []

	options: QueueOptions

	worker: (payload: TPlayload) => Promise<void>

	queueRefreshTime = 100

	enqueued = 0

	constructor (worker: (payload: TPlayload) => Promise<void>, options: QueueOptions) {
		this.worker = worker

		this.options = options
	}

	addPayload (payload: TPlayload[] | TPlayload): void{
		if (Array.isArray(payload)) {
			this.payload = payload as (TPlayload & QueuePayload)[]
		} else {
			this.payload.push(payload as (TPlayload & QueuePayload))
		}
	}

	async process (): Promise<void> {
		if (!this.payload.length) {
			return
		}

		this.setMetadata()

		await new Promise((resolve) => {
			const checkQueue = setInterval(() => {
				if (this.enqueued < this.options.concurrency && this.payload.length > 0) {
					this.initWorker()
				} else if (this.enqueued === 0) {
					clearInterval(checkQueue)
					resolve()
				}
			}, this.queueRefreshTime)
		})
	}

	get info (): QueueOptions & { payload : (Record<string, unknown> & QueuePayload)[]} {
		return {
			...this.options,
			payload: this.payload,
		}
	}

	kill (): void {
		this.payload.length = 0
	}

	private async initWorker () {
		const payloadOnProcess = this.payload.shift()

		if (payloadOnProcess) {
			this.enqueued++

			try {
				if (payloadOnProcess.metadata.retries <= this.options.retries) {
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

	private setMetadata () {
		this.payload = this.payload.map((payload, index) => ({
			...payload,
			metadata: {
				jobId: index,
				error: null,
				retries: 0,
			},
		}))
	}

	private async delay (milliseconds: number) {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
}

export default Queue

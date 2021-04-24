export interface Store<Model> {
	set (id: string, data: Model): Promise<void>
	delete (id: string): Promise<void>
	getOne (id: string): Promise<Model>
	getAll (): Promise<Model[]>
	getKeys (): Promise<string[]>
}

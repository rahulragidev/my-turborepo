export interface GraphQLResponse<T = unknown> {
	data?: T
	errors?: GraphQLError[]
	extensions?: unknown
	status: number
	[key: string]: unknown
}

export interface ApiResponse<T> {
	data: T
}

import { GetToken } from "@clerk/types"
import { GraphQLClient, RequestDocument } from "graphql-request"

export type FetchWithTokenArgs = {
	query: RequestDocument
	variables?: Record<string, any>
	// getToken is an asynchronous function from @clerk/nextjs
	getToken?: GetToken
	token?: string | GetToken
	signal?: AbortSignal
	next?: Record<string, any>
}

const fetchWithToken = async <TData>({
	query,
	variables = {},
	getToken,
	signal,
	token,
	next,
}: FetchWithTokenArgs): Promise<TData> => {
	let tokenValue = null

	if (token) tokenValue = token

	// First get the token
	if (getToken) tokenValue = await getToken({ template: "front_end_app" })

	// Then get the endpoint from the environment variables
	const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}`

	// Craete a graphqlClient
	const graphqlClient = new GraphQLClient(endpoint, {
		signal,
		headers: {
			// Add the token as the Bearer
			Authorization: `Bearer ${tokenValue}`,
		},
		next,
	})

	// Return the graphqlClient request
	return graphqlClient.request<TData>(query, variables)
}

export default fetchWithToken

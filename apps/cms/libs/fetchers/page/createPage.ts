import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import { PageResponse } from "types/generated/types"
import fetchWithToken from "../fetchWithToken"

const CREATE_PAGE_QUERY = gql`
	mutation ($siteId: String!, $name: String!, $parent: String) {
		data: createPage(name: $name, siteId: $siteId, parent: $parent) {
			success
			message
			data {
				id
				name
				slug
				createdAt
				updatedAt
				jsonDraftBody
				jsonBody
			}
		}
	}
`

const createPage = async ({
	siteId,
	name,
	token,
	parent,
}: {
	siteId: string
	name: string
	token: string
	parent?: string
}): Promise<GraphQLResponse<PageResponse>> => {
	const variables = { siteId, name, parent }
	const result = await fetchWithToken<GraphQLResponse<PageResponse>>({
		query: CREATE_PAGE_QUERY,
		variables,
		token,
	})

	return result
}

export default createPage

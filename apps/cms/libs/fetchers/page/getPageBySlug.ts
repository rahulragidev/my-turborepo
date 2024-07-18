import { GetToken } from "@clerk/types"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import { PageFilterEnum, PageResponse } from "types/generated/types"
import fetchWithToken from "../fetchWithToken"

const GET_PAGE_BY_SLUG = gql`
	query ($siteId: String!, $slug: String!, $filter: PageFilterEnum) {
		data: getPageBySlug(slug: $slug, siteId: $siteId, filter: $filter) {
			success
			message
			data {
				name
				id
			}
		}
	}
`

const getPageBySlug = async (
	slug: string,
	siteId: string,
	getToken: GetToken,
	filter?: PageFilterEnum
): Promise<GraphQLResponse<PageResponse>> => {
	try {
		const page = await fetchWithToken<GraphQLResponse<PageResponse>>({
			query: GET_PAGE_BY_SLUG,
			variables: { slug, siteId, filter },
			getToken,
		})
		return page
	} catch (error: any) {
		console.log("Error with getPageBySlug", error)
		return error
	}
}

export default getPageBySlug

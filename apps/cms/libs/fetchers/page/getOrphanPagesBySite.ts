import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import { PageFilterEnum, PageResponse } from "types/generated/types"
import { GetToken } from "@clerk/types"
import fetchWithToken from "../fetchWithToken"

const GET__ALL_ORPHAN_PAGES_BY_SITE = gql`
	query ($siteId: String!, $filter: PageFilterEnum) {
		data: getAllOrphanPagesBySite(siteId: $siteId, filter: $filter) {
			success
			message
			data {
				id
				name
				slug
				isPublic
				children {
					id
					name
					slug
					isPublic
				}
			}
		}
	}
`

const getOrphanPagesBySite = async (
	siteId: string,
	getToken: GetToken,
	filter?: PageFilterEnum
): Promise<GraphQLResponse<PageResponse>> => {
	try {
		const page = await fetchWithToken<GraphQLResponse<PageResponse>>({
			query: GET__ALL_ORPHAN_PAGES_BY_SITE,
			variables: { siteId, filter },
			getToken,
		})

		return page
	} catch (error: any) {
		console.log("Error with getPageBySlug", error)
		return error
	}
}

export default getOrphanPagesBySite

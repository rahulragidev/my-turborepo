import { useAuth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR, { SWRResponse } from "swr"
import { PagesResponse } from "types/generated/types"

const GET_ORPHAN_PAGES_BY_SITE = gql`
	query ($filter: PageFilterEnum, $siteId: String!) {
		data: getAllOrphanPagesBySite(filter: $filter, siteId: $siteId) {
			success
			message
			statusCode
			data {
				id
				name
				slug
				priority
				isPublic
				children {
					id
					name
					slug
					priority
					isPublic
					children {
						id
						name
						slug
						priority
					}
				}
			}
		}
	}
`

const useOrphanPages = (siteId: string): SWRResponse<GraphQLResponse<PagesResponse>> => {
	const { getToken, userId, isLoaded } = useAuth()

	const response = useSWR(
		isLoaded ? [siteId, GET_ORPHAN_PAGES_BY_SITE, userId] : null,
		() =>
			fetchWithToken<GraphQLResponse<PagesResponse>>({
				query: GET_ORPHAN_PAGES_BY_SITE,
				variables: {
					siteId,
				},
				getToken,
			})
	)
	return response
}

export default useOrphanPages

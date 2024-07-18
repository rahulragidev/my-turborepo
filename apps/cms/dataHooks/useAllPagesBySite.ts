import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR from "swr"
import { PagesResponse } from "types/generated/types"

const GET_ALL_PAGES_BY_SITE = gql`
	query GetAllPagesBySite($siteId: String!) {
		data: getAllPagesBySite(siteId: $siteId) {
			message
			success
			data {
				id
				name
				slug
				isPublic
				isFeatured
			}
		}
	}
`

const useAllPagesBySite = (siteId: string) => {
	const response = useSWR(
		[GET_ALL_PAGES_BY_SITE, siteId],
		siteId
			? () =>
					fetchWithToken<GraphQLResponse<PagesResponse>>({
						query: GET_ALL_PAGES_BY_SITE,
						variables: {
							siteId,
						},
					})
			: null
	)

	return response
}

export default useAllPagesBySite

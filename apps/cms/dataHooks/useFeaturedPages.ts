/**
 * useFeaturedPages.ts hook function
 * -----------------------------
 *
 * Reusable hook that fetches a site by it's UID.
 *
 */

import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR, { SWRResponse } from "swr"
import { PagesResponse } from "types/generated/types"

import { useAuth } from "@clerk/nextjs"

const useFeaturedPages = (
	siteId: string
): SWRResponse<GraphQLResponse<PagesResponse>> => {
	const { getToken, isLoaded } = useAuth()
	const response = useSWR(
		isLoaded ? [GET_FEATURED_BLOGS_BY_SITEID, siteId] : null,
		() =>
			fetchWithToken<GraphQLResponse<PagesResponse>>({
				query: GET_FEATURED_BLOGS_BY_SITEID,
				variables: {
					siteId,
				},
				getToken,
			})
	)
	return response
}

export default useFeaturedPages

const GET_FEATURED_BLOGS_BY_SITEID = gql`
	query Query($siteId: String!, $filter: PageFilterEnum) {
		data: getFeaturedPagesBySite(siteId: $siteId, filter: $filter) {
			success
			message
			data {
				id
				isFeatured
				isPublic
				lastPublishedAt
				name
				slug
			}
		}
	}
`

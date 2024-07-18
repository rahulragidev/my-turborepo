import { useAuth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "@repo/utils/fetchWithToken"
import useSWR, { SWRResponse } from "swr"
import { PageResponse } from "@repo/utils/types"

export const GET_ROOT_PAGE_QUERY = gql`
	query ($siteId: String!) {
		data: getRootPage(siteId: $siteId) {
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
				}
			}
		}
	}
`

const useRootPage = (siteId: string): SWRResponse<GraphQLResponse<PageResponse>> => {
	const { getToken, userId, isLoaded } = useAuth()

	const response = useSWR(isLoaded ? [siteId, GET_ROOT_PAGE_QUERY, userId] : null, () =>
		fetchWithToken<GraphQLResponse<PageResponse>>({
			query: GET_ROOT_PAGE_QUERY,
			variables: {
				siteId,
			},
			getToken,
		})
	)
	return response
}

export default useRootPage

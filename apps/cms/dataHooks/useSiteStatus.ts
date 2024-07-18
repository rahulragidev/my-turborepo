import { useAuth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { useEffect, useState } from "react"
import useSWR, { SWRResponse } from "swr"
import { SiteStatusResponse } from "types/generated/types"

const GET_SITE_STATUS = gql`
	query GetSitestatus($id: String!) {
		data: getSiteStatus(id: $id) {
			success
			message
			data {
				createdAt
				readyState
				domain
			}
		}
	}
`

const useSiteStatus = (id: string): SWRResponse<GraphQLResponse<SiteStatusResponse>> => {
	const { userId, getToken, isLoaded } = useAuth()
	const [shouldPoll, setShouldPoll] = useState(false)

	const response = useSWR(
		// waits for token to be ready before making the GET_SITE_STATUS call
		isLoaded && id ? [GET_SITE_STATUS, id, userId] : null,
		() =>
			fetchWithToken<GraphQLResponse<SiteStatusResponse>>({
				query: GET_SITE_STATUS,
				variables: {
					id,
				},
				getToken,
			}),
		{
			refreshInterval: shouldPoll ? 50 * 1000 : 0,
		}
	)

	useEffect(() => {
		// Check the readyState and start or stop polling accordingly
		if (response.data) {
			setShouldPoll(response?.data?.data?.data?.readyState !== "READY")
		}
	}, [response.data])

	return response
}

export default useSiteStatus

/**
 * useSite.ts hook function
 * -----------------------------
 *
 * Reusable hook that fetches a site by it's UID.
 *
 */

import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR, { SWRResponse } from "swr"
import { SiteResponse } from "types/generated/types"

import { useAuth } from "@clerk/nextjs"

const useSite = (id: string): SWRResponse<GraphQLResponse<SiteResponse>> => {
	const { getToken, userId, isLoaded } = useAuth()
	const variables = { id }
	const response = useSWR(isLoaded ? ["SITE_QUERY", id, userId] : null, () =>
		fetchWithToken<GraphQLResponse<SiteResponse>>({
			query: SITE_QUERY,
			variables,
			getToken,
		})
	)

	return response
}

export default useSite

export const SITE_QUERY = gql`
	query site($id: String!) {
		data: getMySiteById(id: $id) {
			success
			message
			data {
				id
				name
				slug
				logoPreference
				textLogo
				url
				vercelProjectId
				primaryDomain
				customDomain {
					name
					apexName
				}
				pages {
					id
					slug
					name
					children {
						id
						slug
						name
					}
				}
			}
		}
	}
`

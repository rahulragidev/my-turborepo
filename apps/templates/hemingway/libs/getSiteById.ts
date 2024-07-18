import { apiEndpoint, siteId } from "@/config"
import { ApiResponse, GraphQLResponse } from "@/types"
import { SiteResponse } from "@/types/generated/types"
import { gql } from "graphql-request"

const GET_SITE_BY_ID = gql`
	query GetSiteById($siteId: String!) {
		data: getSiteById(id: $siteId) {
			message
			statusCode
			success
			data {
				name
				textLogo
				primaryDomain
				owner {
					name
					email
				}
			}
		}
	}
`

const getSideById = async (): Promise<ApiResponse<
	GraphQLResponse<SiteResponse>
> | null> => {
	try {
		const response = await fetch(apiEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: GET_SITE_BY_ID,
				variables: {
					siteId: siteId,
				},
			}),
			next: {
				revalidate: 2,
			},
		})
		if (!response.ok) throw new Error(response.statusText)
		return response.json()
	} catch (error) {
		console.error(error)
		return null
	}
}

export default getSideById

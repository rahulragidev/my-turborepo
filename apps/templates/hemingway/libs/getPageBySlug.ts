import { apiEndpoint, siteId } from "@/config"
import { ApiResponse, GraphQLResponse } from "@/types"
import { PageResponse } from "@/types/generated/types"
import { gql } from "graphql-request"

// GraphQL Query for this page
const GET_PAGE_BY_SLUG = gql`
	query GetPageBySlug($siteId: String!, $slug: String!) {
		data: getPageBySlug(siteId: $siteId, slug: $slug) {
			success
			message
			data {
				id
				slug
				name
				body
				jsonBody
				isPublic
				metaTitle
				metaDescription
			}
		}
	}
`

// fetch the data for the param
const getPageBySlug = async (slug: string) => {
	try {
		console.log("getPage called:", { siteId, slug })
		const response = await fetch(apiEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: GET_PAGE_BY_SLUG,
				variables: {
					siteId: siteId,
					slug: slug,
				},
			}),
			next: {
				tags: [slug],
			},
		})

		if (!response.ok) throw new Error(response.statusText)

		const page: ApiResponse<GraphQLResponse<PageResponse>> = await response.json()
		// console.log(`getPage response: \n${JSON.stringify(page, null, 2)}`)

		return page
	} catch (error) {
		console.error(error)
	}
}

export default getPageBySlug

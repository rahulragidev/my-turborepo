// This import causes a build error if imported on the client side
import "server-only"
import { apiEndpoint, siteId } from "@/config"
import { gql } from "graphql-request"

const GET_ALL_PAGES_BY_SITE = gql`
	query GetAllPagesBySite($siteId: String!, $filter: PageFilterEnum) {
		data: getAllPagesBySite(siteId: $siteId, filter: $filter) {
			data {
				id
				slug
				name
				isPublic
			}
		}
	}
`

const getAllPagesBySite = async () => {
	const response = await fetch(apiEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: GET_ALL_PAGES_BY_SITE,
			variables: {
				siteId: siteId,
				filter: "PUBLIC",
				//filter: "SLUG",
			},
		}),
	})
	const pages = await response.json()

	return pages
}

export default getAllPagesBySite

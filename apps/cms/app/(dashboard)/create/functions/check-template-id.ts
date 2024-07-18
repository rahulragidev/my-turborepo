import { auth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { TemplateResponse } from "types/generated/types"

const GET_TEMPLATE = gql`
	query GetTemplate($id: String!) {
		data: getTemplateById(id: $id) {
			success
			message
			data {
				id
				name
				demoLink
				bannerImage
				description
				creator
				stripeProduct {
					default_price {
						currency
						unit_amount
						recurring {
							interval
						}
					}
				}
			}
		}
	}
`

export default async function checkTemplateId(templateId?: string) {
	try {
		const token = await auth().getToken({
			template: "front_end_app",
		})

		if (!token || !templateId) return false

		const templateResponse = await fetchWithToken<GraphQLResponse<TemplateResponse>>({
			query: GET_TEMPLATE,
			token,
			variables: {
				id: templateId,
			},
		})

		return !!templateResponse?.data?.data
	} catch (e) {
		if (process.env.NODE_ENV === "development") console.error(e)

		return false
	}
}

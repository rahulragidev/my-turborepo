"use server"

import { auth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { PageResponse } from "types/generated/types"

const CREATE_PAGE_QUERY = gql`
	mutation ($siteId: String!, $name: String!, $parent: String) {
		data: createPage(name: $name, siteId: $siteId, parent: $parent) {
			success
			message
			data {
				id
				name
				slug
				createdAt
				updatedAt
				jsonDraftBody
				jsonBody
			}
		}
	}
`

export const createSubPage = async (previousState: any, formData: FormData) => {
	try {
		console.log("createSubPage called")
		console.log("siteID", formData.get("siteId"))
		console.log("name", formData.get("name"))
		console.log("parent", formData.get("parent"))
		const token = await auth().getToken({
			template: "front_end_app",
		})

		const response = await fetchWithToken<GraphQLResponse<PageResponse>>({
			query: CREATE_PAGE_QUERY,
			variables: {
				siteId: formData.get("siteId"),
				name: formData.get("name"),
				parent: formData.get("parent"),
			},
			token: token as string,
		})
		if (!response.data?.success) {
			// revalidate the site query
			throw new Error(response.data?.message || "something went wrong")
		}
		return {
			success: true,
			message: response.data.message,
			data: response.data.data,
		}
	} catch (error: any) {
		console.error("createSubPage error:", error)
		return {
			success: false,
			message: error?.message || "Internal",
			data: null,
		}
	}
}

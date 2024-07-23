"use server"

import { auth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { SiteResponse } from "types/generated/types"

function getToken() {
	return auth().getToken({
		template: "front_end_app",
	})
}

interface ActionResponse {
	success: boolean
	message: string
}

const DELETE_PAGE = gql`
	mutation DELETE_PAGE($id: String!) {
		data: deletePage(id: $id) {
			success
			message
		}
	}
`

export async function deletePage(id: string): Promise<ActionResponse> {
	const token = await getToken()

	try {
		console.log("deletePage -> id", id)
		const result = await fetchWithToken<GraphQLResponse<SiteResponse>>({
			query: DELETE_PAGE,
			variables: { id },
			token: token!,
		})

		console.log("deletePage -> result", JSON.stringify(result, null, 2))

		if (!result.data?.success) {
			// this is handled in the catch block
			throw new Error(result.data?.message || "Something went wrong")
		}

		return {
			success: true,
			message: "Page deleted",
		}
	} catch (e) {
		console.error(e)

		return {
			success: false,
			message: (e as Error).message ?? "Something went wrong",
		}
	}
}

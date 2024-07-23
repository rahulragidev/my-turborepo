"use server"

import { auth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { Site, SiteResponse } from "types/generated/types"
import { z } from "zod"

function getToken() {
	return auth().getToken({
		template: "front_end_app",
	})
}

interface ActionResponse {
	success: boolean
	message: string
}

const UpdateSiteNamePayload = z.object({
	name: z.string(),
})

const UpdateSiteTextLogoPayload = z.object({
	textLogo: z.string(),
})

const DELETE_SITE = gql`
	mutation DELETE_SITE($id: String!) {
		data: deleteSite(id: $id) {
			success
			message
		}
	}
`
const UPDATE_SITE = gql`
	mutation UpdateSite($data: UpdateSiteInput!, $id: String!) {
		response: updateSite(data: $data, id: $id) {
			success
			message
			data {
				name
				textLogo
			}
		}
	}
`

// state is tricky, is here to satisfy the `useFormState` hook
export async function updateSiteName(
	site: Site,
	_state: any,
	data: FormData
): Promise<ActionResponse | null> {
	const token = await getToken()
	const payload = UpdateSiteNamePayload.safeParse(Object.fromEntries(data.entries()))

	if (!token) {
		return {
			success: false,
			message: "Authentication required",
		}
	}

	if (payload.success === false) {
		console.error(payload.error)

		return {
			success: false,
			message: payload.error.message ?? "Invalid payload",
		}
	}

	try {
		await fetchWithToken({
			token,
			query: UPDATE_SITE,
			variables: {
				id: site.id,
				data: {
					name: payload.data.name,
					textLogo: site.textLogo,
				},
			},
		})

		return {
			success: true,
			message: "Site name updated",
		}
	} catch (e) {
		console.error(e)

		return {
			success: false,
			message: (e as Error).message ?? "Something went wrong",
		}
	}
}

// state is tricky, is here to satisfy the `useFormState` hook
export async function updateSiteTextLogo(site: Site, _state: any, data: FormData) {
	const token = await getToken()
	const payload = UpdateSiteTextLogoPayload.safeParse(
		Object.fromEntries(data.entries())
	)

	if (!token) {
		return {
			success: false,
			message: "Authentication required",
		}
	}

	if (payload.success === false) {
		console.error(payload.error)

		return {
			success: false,
			message: payload.error.message ?? "Invalid payload",
		}
	}

	try {
		await fetchWithToken({
			token,
			query: UPDATE_SITE,
			variables: {
				id: site.id,
				data: {
					textLogo: payload.data.textLogo,
					name: site.name,
				},
			},
		})

		return {
			success: true,
			message: "Site logo updated",
		}
	} catch (e) {
		console.error(e)

		return {
			success: false,
			message: (e as Error).message ?? "Something went wrong",
		}
	}
}

export async function deleteSite(site: Site) {
	const token = await getToken()

	try {
		const result = await fetchWithToken<GraphQLResponse<SiteResponse>>({
			query: DELETE_SITE,
			variables: { id: site.id },
			token: token!,
		})

		if (!result.data?.success) {
			// this is handled in the catch block
			throw new Error(result.data?.message || "Something went wrong")
		}

		return {
			success: true,
			message: "Site deleted",
		}
	} catch (e) {
		console.error(e)

		return {
			success: false,
			message: (e as Error).message ?? "Something went wrong",
		}
	}
}

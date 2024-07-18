import { GetToken } from "@clerk/types"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { CreateSiteResponse } from "types/generated/types"

const CREATE_SITE_MUTATION = gql`
	mutation CreateSite($data: SiteInput!) {
		data: createSite(data: $data) {
			siteCreated
			vercelProjectCreated
			pageCreated
			frameWorkSet
			envsAdded
			subdomainAdded
			siteUpdatedWithVercelProjectId
			message
			data {
				id
				name
			}
		}
	}
`

type CreateSideStatus =
	| {
			status: "loading"
	  }
	| {
			status: "created"
			id?: string
	  }
	| {
			status: "error"
			message: string
	  }

export default async function* createSite(
	getToken: GetToken,
	slug: string,
	templateId: string
): AsyncGenerator<CreateSideStatus> {
	try {
		yield {
			status: "loading",
		}

		const res = await fetchWithToken<GraphQLResponse<CreateSiteResponse>>({
			query: CREATE_SITE_MUTATION,
			variables: {
				data: {
					slug,
					templateId,
				},
			},
			getToken,
		})

		if (res.data?.siteCreated) {
			yield {
				status: "created",
				id: res.data?.data?.id,
			}
		} else {
			yield {
				status: "error",
				message:
					res.data?.message ?? "Something went wrong while creating your site",
			}
		}
	} catch (error) {
		yield {
			status: "error",
			message:
				(error as Error)?.message ??
				"Something went wrong while creating your site",
		}
	}
}

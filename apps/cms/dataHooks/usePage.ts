/**
 * usePageBySlug.ts hook function
 * -----------------------------
 *
 * Reusable hook that fetches a site by it's UID.
 *
 */

import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR, { SWRResponse } from "swr"
import { PageFilterEnum, PageResponse } from "types/generated/types"

import { useAuth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { useParams } from "next/navigation"

const GET_PAGE_BY_SLUG = gql`
	query ($siteId: String!, $slug: String!, $filter: PageFilterEnum) {
		data: getPageBySlug(slug: $slug, siteId: $siteId, filter: $filter) {
			success
			message
			statusCode
			data {
				id
				name
				slug
				body
				draftBody
				jsonDraftBody
				body
				jsonBody
				isPublic
				createdAt
				updatedAt
				lastPublishedAt
				priority
				metaTitle
				metaDescription
				isFeatured
				parent {
					id
					slug
					isPublic
					draftBody
					jsonDraftBody
					body
					jsonBody
					createdAt
					updatedAt
					lastPublishedAt
					priority
				}
				children {
					id
					name
					slug
					priority
					isPublic
				}
			}
		}
	}
`

const usePageBySlug = ({
	onSuccessCallback,
}: {
	onSuccessCallback?: (_data: GraphQLResponse<PageResponse>) => void
}): SWRResponse<GraphQLResponse<PageResponse>> => {
	const { getToken, userId, isLoaded } = useAuth()
	const { siteId, pageSlug } = useParams<{ siteId: string; pageSlug: string[] }>() ?? {}

	const currentSlug = (pageSlug?.[pageSlug.length - 1] as string) || "index"
	const variables = {
		filter: PageFilterEnum.Any,
		siteId: siteId as string,
		slug: currentSlug,
	}

	const response = useSWR(
		isLoaded ? [siteId, currentSlug, userId, GET_PAGE_BY_SLUG] : null,
		() =>
			fetchWithToken<GraphQLResponse<PageResponse>>({
				query: GET_PAGE_BY_SLUG,
				variables,
				getToken,
			}),
		{
			onSuccess: async data => {
				// console.log(data)
				if (onSuccessCallback) {
					await onSuccessCallback(data)
				}
			},
		}
	)

	return response
}

export default usePageBySlug

"use client"

import { useAuth } from "@clerk/nextjs"
import Button from "components/Button"
import usePageBySlug from "dataHooks/usePage"
import useSiteStatus from "dataHooks/useSiteStatus"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { Send } from "lucide-react"
import { useParams } from "next/navigation"
import { useCallback } from "react"
import toast from "react-hot-toast"
import { match } from "ts-pattern"
import { PageResponse } from "types/generated/types"

const PUBLISH_PAGE = gql`
	mutation PUBLISH_PAGE($id: String!) {
		data: publishPage(id: $id) {
			success
			message
			data {
				id
				body
				draftBody
				jsonBody
				jsonDraftBody
				isPublic
				lastPublishedAt
			}
		}
	}
`

const PageActionButton = () => {
	const { siteId } = useParams<{ siteId: string; pageSlug?: string[] }>() ?? {}
	const { getToken } = useAuth()

	const { data: siteStatus, error: siteStatusError } = useSiteStatus(siteId as string)
	const { data: pageData, error: pageError, mutate: pageMutate } = usePageBySlug({})

	const page = pageData?.data?.data
	const isSiteDeployed = siteStatus?.data?.data?.readyState === "READY"
	const pageHasChanged = Boolean(
		JSON.stringify(page?.jsonBody) !== JSON.stringify(page?.jsonDraftBody)
	)

	const buttonText = match({
		page,
		pageHasChanged,
	})
		.with({ page: { isPublic: true }, pageHasChanged: true }, () => "Publish Changes")
		.with({ page: { isPublic: false }, pageHasChanged: false }, () => "Publish Page")
		.otherwise(() => "Publish Page")

	const publishPage = useCallback(async (): Promise<PageResponse> => {
		if (!page)
			return {
				success: false,
				message: "Error publishing page",
			}

		try {
			const response = await fetchWithToken<GraphQLResponse<PageResponse>>({
				getToken,
				query: PUBLISH_PAGE,
				variables: {
					id: page.id,
				},
			})
			if (!response.data?.success) {
				Promise.reject(response.message)
			}

			return {
				...response.data,
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Error publishing page"

			console.error(message, error)
			toast.error(message)

			return {
				success: false,
				message,
			}
		}
	}, [getToken, page])

	const handlePublishPage = useCallback(() => {
		toast.promise(publishPage(), {
			loading: "Publishing Page..",
			success: data => {
				if (data?.success) {
					pageMutate()
					return "Page Published"
				}

				throw new Error(data.message ?? "Error publishing page")
			},
			error: error => {
				pageMutate()

				return error instanceof Error ? error.message : "Error publishing page"
			},
		})
	}, [publishPage, pageMutate])

	if (!isSiteDeployed) return null

	// only show button if page is not public or page has changed
	if (!page?.isPublic || pageHasChanged) {
		return (
			<Button
				// fixing optical alignment with Icon
				className="p-2 rounded-full md:rounded"
				disabled={
					(!pageData && !pageError) || !page || !siteId || siteStatusError
				}
				variant="primary"
				onClick={handlePublishPage}>
				<p className="text-sm hidden md:block">{buttonText}</p>
				<Send height={14} />
			</Button>
		)
	}

	return null
}

export default PageActionButton

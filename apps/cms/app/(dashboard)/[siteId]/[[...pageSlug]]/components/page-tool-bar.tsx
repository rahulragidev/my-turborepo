"use client"

import Button from "components/Button"
import SiteStatus from "components/SiteStatus"
import { useMinimizeMaximize } from "contexts/MinimizeMaximizeContext"
import usePageBySlug from "dataHooks/usePage"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { Menu, Star } from "lucide-react"
import { useCallback } from "react"
import { Minimize2 } from "react-feather"
import toast from "react-hot-toast"
import { PageResponse } from "types/generated/types"
import PageActionButton from "./page-action-button"
import PageSettings from "./page-settings-modal"

const UPDATE_PAGE_IS_FEATURED = gql`
	mutation UPDATE_PAGE_IS_FEATURED($id: String!, $data: UpdatePageInput!) {
		data: updatePage(id: $id, data: $data) {
			success
			message
			statusCode
			data {
				id
				isFeatured
			}
		}
	}
`

const PageToolBar = ({ token }: { token: string }) => {
	const { isMinimized, setIsMinimized } = useMinimizeMaximize()
	const { data: pageData, error: _pageError, mutate: pageMutate } = usePageBySlug({})

	const page = pageData?.data?.data

	const updatePageFeatured = useCallback(async () => {
		try {
			const response = await fetchWithToken<GraphQLResponse<PageResponse>>({
				query: UPDATE_PAGE_IS_FEATURED,
				variables: {
					id: page?.id,
					data: {
						isFeatured: !page?.isFeatured,
					},
				},
				token,
			})

			if (response.data?.success) {
				pageMutate()
				toast.success("Page featured updated")
			}

			console.log(response)
		} catch (error: any) {
			console.error("Error updating page isFeatured", error)
			toast.error("Error making page featured")
		}
	}, [page, pageMutate, token])

	return (
		<div className="flex justify-between items-stretch py-4 mt-2 px-2 md:px-10 mx-auto w-full max-w-5xl">
			<div className="flex items-center space-x-2">
				<Button
					variant="tertiary"
					rounded
					className="p-2 w-10 h-10"
					onClick={() => setIsMinimized(!isMinimized)}>
					{isMinimized ? <Menu height={16} /> : <Minimize2 height={16} />}
				</Button>
			</div>
			<div className="flex items-stretch space-x-2">
				{page?.slug !== "index" && (
					<Button
						rounded
						variant="tertiary"
						className="p-2 w-10 h-10"
						onClick={() => updatePageFeatured()}>
						<Star
							height={18}
							fill={page?.isFeatured ? "gold" : "transparent"}
							strokeWidth={page?.isFeatured ? 0 : 2}
						/>
					</Button>
				)}
				<SiteStatus />
				<PageActionButton />
				<PageSettings />
			</div>
		</div>
	)
}

export default PageToolBar

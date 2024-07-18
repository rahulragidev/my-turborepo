"use client"

import { Editor, Range } from "@tiptap/core"
import Button from "components/Button"
import Input from "components/form/Input"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import { gql } from "graphql-request"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import createPage from "libs/fetchers/page/createPage"
import Link from "next/link"
import { useCallback, useState } from "react"
import { ArrowRight } from "react-feather"
import toast from "react-hot-toast"
import useSWR, { SWRResponse } from "swr"
import { SiteResponse, UserResponse } from "types/generated/types"

export const SITE_QUERY = gql`
	query site($id: String!) {
		data: getMySiteById(id: $id) {
			success
			message
			data {
				id
				pages {
					id
					slug
					name
				}
			}
		}
	}
`
const USER_SUBSCRIPTION = gql`
	query {
		data: me {
			data {
				subscription {
					status
				}
			}
		}
	}
`

const AddSubPageDialogComponent = ({
	editor,
	range,
	defaultOpen = true,
	onClose,
}: {
	editor: Editor
	range?: Range
	defaultOpen?: boolean
	onClose: () => void
}) => {
	const [pageName, setPageName] = useState("")
	const [isCreating, setIsCreating] = useState(false)
	const [pageModelOpen, setPageModelOpen] = useState(defaultOpen)

	console.log("range from AddSubPageDialogComponent", range)
	const siteId =
		typeof editor.options?.editorProps?.attributes === "object"
			? (editor.options.editorProps.attributes.siteId as string)
			: ""

	const token =
		typeof editor.options?.editorProps?.attributes === "object"
			? (editor.options.editorProps.attributes.token as string)
			: ""

	const parentId =
		typeof editor.options?.editorProps?.attributes === "object"
			? (editor.options.editorProps.attributes.pageId as string)
			: ""

	const { data: userData } = useSWR<SWRResponse<UserResponse>>(
		[USER_SUBSCRIPTION, token],
		() =>
			fetchWithToken({
				query: USER_SUBSCRIPTION,
				token,
			})
	)

	const { data: siteData } = useSWR<SWRResponse<SiteResponse>>(
		[SITE_QUERY, siteId],
		() =>
			fetchWithToken({
				query: SITE_QUERY,
				variables: { id: siteId },
				token,
			})
	)

	const handleCreatePage = useCallback(async () => {
		try {
			debugger
			console.log("create page", {
				name: pageName,
				siteId,
				parent: parentId,
				token,
			})
			setIsCreating(true)

			// creatingPage from the createPage function in the libs/fetchers folder
			const response = await createPage({
				siteId,
				name: pageName,
				parent: parentId,
				token,
			})

			if (response.data?.success) {
				const page = response.data?.data
				if (!page) throw new Error("No page data returned.")

				const canInsertPageNode = editor.can().insertContent({
					type: "page-node",
					attrs: { id: page.id, slug: page.slug, name: page.name },
				})
				if (!canInsertPageNode) {
					throw new Error("Editor Cannot Add a page node.")
				}
				editor
					.chain()
					.focus()
					.setPage({
						id: page.id as string,
						slug: page.slug as string,
						name: page.name as string,
					})
					.enter()
					.run()
				setIsCreating(false)
				onClose()
			}
		} catch (error: any) {
			setIsCreating(false)
			toast.error(`Error: ${error.message}`)
		}
	}, [pageName, siteId, parentId, token, editor, onClose])

	// renderContent
	const renderContent = useCallback(() => {
		const allowedToCreatePage =
			(siteData?.data?.data?.pages?.length &&
				siteData?.data?.data?.pages?.length < 4) ||
			userData?.data?.data?.subscription?.status === "active"

		if (allowedToCreatePage) {
			return (
				<div className="p-4 space-y-4">
					<h2>Add A Sub Page</h2>
					<Input
						type="text"
						value={pageName}
						onChange={e => setPageName(e.target.value)}
						name="page-name"
					/>
					<div className="flex items-center justify-end gap-2">
						<Button variant="tertiary">
							<span>Cancel</span>
						</Button>
						<Button loading={isCreating} onClick={() => handleCreatePage()}>
							<span>Create Sub Page</span>
						</Button>
					</div>
				</div>
			)
		}
		return (
			<div className="p-4 space-y-4">
				<h2 className="text-2xl">Limit Reached</h2>
				<p className="text-sm text-slate-300">
					{/* Creative line here to ask users to give a unique page name */}
					You&apos;ve reached the limit of 3 pages. Please subscribe to create
					more pages.
				</p>
				<div className="flex justify-end mt-4 space-x-2 w-full">
					<Link href="/pricing">
						<Button>
							<p>Subscribe Now</p>
							<ArrowRight />
						</Button>
					</Link>
				</div>
			</div>
		)
	}, [
		handleCreatePage,
		isCreating,
		pageName,
		siteData?.data?.data?.pages?.length,
		userData?.data?.data?.subscription?.status,
	])
	return (
		<CustomDialogBox
			open={pageModelOpen}
			onOpenChange={open => setPageModelOpen(open)}>
			{renderContent()}
		</CustomDialogBox>
	)
}

export default AddSubPageDialogComponent

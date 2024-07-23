"use client"

import { Editor, Range } from "@tiptap/core"
import Button from "components/Button"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import { gql } from "graphql-request"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight } from "react-feather"
import useSWR, { SWRResponse } from "swr"
import { SiteResponse, UserResponse } from "types/generated/types"
import CreateSubPageForm from "./create-sub-page-form"

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

	//const handleCreatePage = useCallback(async () => {
	//	try {
	//		debugger
	//		console.log("create page", {
	//			name: pageName,
	//			siteId,
	//			parent: parentId,
	//			token,
	//		})
	//		setIsCreating(true)

	//		// creatingPage from the createPage function in the libs/fetchers folder
	//		const response = await createPage({
	//			siteId,
	//			name: pageName,
	//			parent: parentId,
	//			token,
	//		})

	//		if (response.data?.success) {
	//			const page = response.data?.data
	//			if (!page) throw new Error("No page data returned.")

	//			const canInsertPageNode = editor.can().insertContent({
	//				type: "page-node",
	//				attrs: { id: page.id, slug: page.slug, name: page.name },
	//			})
	//			if (!canInsertPageNode) {
	//				throw new Error("Editor Cannot Add a page node.")
	//			}
	//			editor
	//				.chain()
	//				.focus()
	//				.setPage({
	//					id: page.id as string,
	//					slug: page.slug as string,
	//					name: page.name as string,
	//				})
	//				.enter()
	//				.run()
	//			setIsCreating(false)
	//			onClose()
	//		}
	//	} catch (error: any) {
	//		setIsCreating(false)
	//		toast.error(`Error: ${error.message}`)
	//	}
	//}, [pageName, siteId, parentId, token, editor, onClose])

	const allowedToCreatePage = useMemo(() => {
		const noOfCurrentPages = siteData?.data?.data?.pages?.length ?? 0
		const subscriptionActive = userData?.data?.data?.subscription?.status === "active"
		if (noOfCurrentPages < 4 || subscriptionActive) {
			return true
		}
		return false
	}, [siteData?.data?.data?.pages?.length, userData?.data?.data?.subscription?.status])

	// form actions

	const initialFormState = {
		message: "",
	}

	//const { pending } = useFormStatus()

	if (allowedToCreatePage) {
		return (
			<CustomDialogBox
				open={pageModelOpen}
				onOpenChange={open => setPageModelOpen(open)}>
				<CreateSubPageForm
					editor={editor}
					parentId={parentId}
					siteId={siteId}
					onClose={onClose}
				/>
			</CustomDialogBox>
		)
	}
	return (
		<CustomDialogBox
			open={pageModelOpen}
			onOpenChange={open => setPageModelOpen(open)}>
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
		</CustomDialogBox>
	)
}

export default AddSubPageDialogComponent

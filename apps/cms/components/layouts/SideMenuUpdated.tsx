import { useAuth } from "@clerk/nextjs"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import clsx from "clsx"
import Button from "components/Button"
import SiteStatus from "components/SiteStatus"
import useOrphanPages from "dataHooks/useOrphanPages"
import { Reorder, motion } from "framer-motion"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import createPage from "libs/fetchers/page/createPage"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { MoreVertical, PlusCircle } from "react-feather"
import { Home, Plus } from "react-iconly"
import { Page, ResponseSchema, UpdatePagesPriorityInput } from "types/generated/types"
import CustomAlertDialog from "./CustomAlertDialog"
// import { debounce } from "lodash"

const MotionWrapper = ({
	children,
	isVisible = true,
}: {
	children: ReactNode
	isVisible: boolean
}) => {
	return (
		<motion.nav
			className="w-screen"
			initial={{ y: 0 }}
			animate={{ y: isVisible ? 0 : "-21vh" }}>
			{children}
		</motion.nav>
	)
}

const SideMenu = (props: { isVisible: boolean }) => {
	// The component accepts a prop `isVisible`, which determines whether the menu is visible or not.
	const { isVisible = true } = props

	// The component makes use of the `useRouter` hook to get access to the router object,
	// and it extracts the `siteId` from the query string of the current URL.
	const router = useRouter()
	const { siteId } = router.query

	const [newPageName, setNewPageName] = useState("")
	const [uiState, setUIState] = useState({
		creatingPage: false,
		dialogOpen: false,
	})

	const [didMount, setDidMount] = useState(false)

	const { getToken } = useAuth()

	// The component makes use of a custom hook called `useOrphanPages`, which fetches a list of pages
	// that are not linked to any other pages. The hook returns an object containing the data and a mutate
	// function, which allows the component to update the data.
	const {
		data: orphanPages,
		error: orphanPagesError,
		mutate: _orphanPagesMutate,
	} = useOrphanPages(siteId as string)

	// The `sortedOrphanPages` variable to return sorted pages according to priority,
	// It is wrapped in a`useMemo` hook to optimize performance.
	// const sortedOrphanPages = useRef<Page[] | undefined>(
	// 	orphanPages?.data?.data?.sort((a, b) => a.priority - b.priority)
	// )

	const [pagesList, setPagesList] = useState([] as Page[])

	const updateSitePagesPriority = useCallback(
		async (
			data: UpdatePagesPriorityInput
		): Promise<GraphQLResponse<ResponseSchema>> => {
			try {
				const response = await fetchWithToken<GraphQLResponse<ResponseSchema>>({
					query: UPDATE_PAGES_PRIORITY,
					variables: { data },
					getToken,
				})
				if (response.data?.success === false)
					throw new Error(response.data?.message as string)
				return response
			} catch (error: any) {
				console.error(error)
				return error
			}
		},
		[getToken]
	)

	const handleCreatePage = useCallback(async () => {
		try {
			const token = (await getToken({ template: "front_end-app" })) as string
			const response = await createPage({
				siteId: siteId as string,
				name: newPageName,
				token,
			})
			if (response?.data?.success === false)
				throw new Error(response.data?.message as string)
			// mutate the orphanPages data
			_orphanPagesMutate()
			// redirect to the newly created page
			router.push(`/${siteId}/${response.data?.data?.slug}`)
			// update ui state
			setUIState({ creatingPage: false, dialogOpen: false })
			// reset the newPageName state
			setNewPageName("")
		} catch (error: any) {
			console.error(error)
			setUIState({ creatingPage: false, dialogOpen: true })
		}
	}, [siteId, newPageName, getToken, _orphanPagesMutate, router])

	//  Prevent the updateSitePagesPriority function from being called too often
	const _handleReorderPages = useCallback(
		(pages: Page[]) => {
			setPagesList(pages)
		},
		[setPagesList]
	)

	useEffect(() => {
		if (orphanPages?.data?.data) {
			setPagesList(orphanPages?.data?.data?.sort((a, b) => a.priority - b.priority))
		}
	}, [orphanPages])

	useEffect(() => {
		if (pagesList && didMount) {
			// construct a new array of pages with just ids and priroties matching their Index
			const newPagesList = pagesList.map((page, index) => {
				return { id: page.id, priority: index }
			})
			console.log("newPagesList", newPagesList)
			// call the updatePagesPriority function
			updateSitePagesPriority({ pagesList: newPagesList })
		}
	}, [pagesList, didMount, updateSitePagesPriority])

	useEffect(() => {
		setDidMount(true)
	}, [])

	if (orphanPages?.data?.success) {
		return (
			<MotionWrapper isVisible={isVisible}>
				<div className="flex justify-between items-stretch py-4 px-12">
					<div className="flex items-stretch rounded-full bg-slate-950">
						<Button rounded variant="tertiary" href="/">
							<Home size="small" />
						</Button>
						<SiteStatus />
						<Button rounded variant="tertiary">
							<MoreVertical height={16} />
						</Button>
					</div>
					<Link
						href={`/${siteId}/`}
						className={clsx(
							"cursor-pointer capitalize px-4 py-2 rounded-full",
							(router.asPath === `/${siteId}` ||
								router.asPath === `/${siteId}/index`) &&
								"bg-slate-950 border-slate-500 border-2"
						)}>
						Home
					</Link>
					<Reorder.Group
						className="flex flex-1"
						axis="x"
						// @ts-ignore
						values={pagesList}
						onReorder={pages => setPagesList(pages)}>
						{pagesList
							?.filter(page => page.slug !== "index")
							.map((page: Page) => (
								<Reorder.Item
									key={page.id}
									value={page}
									className={clsx(
										"cursor-pointer capitalize px-4 py-2 rounded-full",
										router.asPath === `/${siteId}/${page.slug}` &&
											"bg-slate-950 border-slate-500 border-2"
									)}
									onClick={() =>
										router.push(`/${siteId}/${page.slug}`)
									}>
									{/* <CollapsiblePageTab page={page} /> */}
									{page.name}
								</Reorder.Item>
							))}
					</Reorder.Group>

					<CustomAlertDialog
						open={uiState.dialogOpen}
						onOpenChange={open =>
							setUIState(prev => ({ ...prev, dialogOpen: open }))
						}
						triggerButton={
							<Button variant="secondary" rounded className="px-0">
								<p>Add page</p>
								{/* <Plus set="light" /> */}
								<PlusCircle />
							</Button>
						}>
						<AlertDialog.Title className="text-black">
							What&apos;s the name of the page?
						</AlertDialog.Title>

						<input
							name="childPageName"
							onChange={e => setNewPageName(e.target.value)}
							type="text"
							placeholder="Enter name"
							value={newPageName}
							className="w-full input text-slate-800 placeholder:text-slate-100"
						/>

						<div className="flex justify-end space-x-2 w-full">
							<AlertDialog.Cancel>
								<button type="button" className="button text">
									Cancel
								</button>
							</AlertDialog.Cancel>

							<button
								type="button"
								className="flex items-center space-x-2 button filled"
								onClick={handleCreatePage}>
								{uiState.creatingPage ? (
									<div className="w-4 h-4 rounded-full border-2 border-white animate-spin" />
								) : (
									<Plus size="medium" />
								)}
								<span className="mt-[2px]">Create Page</span>
							</button>
						</div>
					</CustomAlertDialog>

					{/* <Link href={`/admin/${siteId}/settings`}>
						<button
							type="button"
							className="flex items-center py-2 px-4 space-x-2">
							<Settings size="small" height={16} />
						</button>
					</Link> */}
				</div>
				{/* <div className="flex px-12 w-full">Add new page button</div> */}
			</MotionWrapper>
		)
	}

	if (orphanPagesError) {
		return (
			<MotionWrapper isVisible={isVisible}>
				<p>{orphanPagesError || "Something is Wrong"}</p>
			</MotionWrapper>
		)
	}
	return (
		<MotionWrapper isVisible={isVisible}>
			<p>Loading...</p>
		</MotionWrapper>
	)
}

export default SideMenu

const UPDATE_PAGES_PRIORITY = gql`
	mutation UPDATE_PAGES_PRIORITY($data: UpdatePagesPriorityInput!) {
		updateSitePagesPriority(data: $data) {
			success
			message
		}
	}
`

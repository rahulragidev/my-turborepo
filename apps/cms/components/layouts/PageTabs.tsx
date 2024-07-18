"use client"

import { useAuth } from "@clerk/nextjs"
import LoadingShimmer from "components/LoadingShimmer"
import useRootPage from "dataHooks/useRootPage"
import { motion } from "framer-motion"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { Home } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { Feather } from "react-feather"
import { Page, ResponseSchema, UpdatePagesPriorityInput } from "types/generated/types"

const MotionWrapper = ({
	children,
	isVisible = true,
}: {
	children: ReactNode
	isVisible?: boolean
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

const PageTabs = () => {
	const router = useRouter()
	const { getToken } = useAuth()
	const pathName = usePathname()
	const params = useParams<{ siteId: string }>()
	const siteId = params?.siteId

	const [pagesList, setPagesList] = useState([] as Page[])
	const [didMount, setDidMount] = useState(false)

	const { data: rootPage, error: rootPageError } = useRootPage(siteId as string)

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

	// Setting orphanPages everytime the data mutates
	useEffect(() => {
		if (rootPage?.data?.data) {
			setPagesList(
				rootPage?.data?.data?.children?.sort((a, b) => a.priority - b.priority)
			)
		}
	}, [rootPage])

	useEffect(() => {
		if (pagesList && didMount) {
			// construct a new array of pages with just ids and priroties matching their Index
			const newPagesList = pagesList.map((page, index) => {
				return { id: page.id, priority: index }
			})
			// console.log("newPagesList", newPagesList)
			// call the updatePagesPriority function
			updateSitePagesPriority({ pagesList: newPagesList })
		}
	}, [pagesList, didMount, updateSitePagesPriority])

	useEffect(() => {
		setDidMount(true)
	}, [])

	if (rootPageError) {
		return (
			<div className="w-full">
				<pre>{rootPageError || "Something is Wrong"}</pre>
			</div>
		)
	}

	const currentPageIsHome = pathName === `/${siteId}` || pathName === `/${siteId}/index`

	if (rootPage?.data?.success) {
		return (
			<div className="w-full hide-scrollbar bg-slate-950 text-slate-400 border-slate-700/25 bg-slate-800/30 backdrop-blur-sm">
				<Link href={`/${siteId}/`}>
					<PageTab
						isHome
						label="home"
						isActive={currentPageIsHome}
						isDraft={false}
					/>
				</Link>

				{pagesList
					?.filter(page => page.slug !== "index")
					.map((page: Page) => (
						<Link href={`/${siteId}/${page.slug}`}>
							<PageTab
								label={page.name}
								isActive={Boolean(pathName === `/${siteId}/${page.slug}`)}
								isDraft={!page.isPublic} // draft if page is not public
							/>
						</Link>
					))}
				{/*<Reorder.Group
					axis="y"
					// @ts-ignore
					values={pagesList}
					onReorder={pages => setPagesList(pages)}>
					{pagesList
						?.filter(page => page.slug !== "index")
						.map((page: Page) => (
							<Reorder.Item
								className="relative z-0"
								key={page.id}
								value={page}
								onClick={() => router.push(`/${siteId}/${page.slug}`)}>
								<PageTab
									label={page.name}
									isActive={Boolean(
										pathName === `/${siteId}/${page.slug}`
									)}
									isDraft={!page.isPublic} // draft if page is not public
								/>
							</Reorder.Item>
						))}
				</Reorder.Group>*/}
			</div>
		)
	}

	if (rootPageError) {
		console.log("rootPageError", rootPageError)
		return (
			<MotionWrapper>
				<p className="text-red-400">Something is Wrong</p>
			</MotionWrapper>
		)
	}
	return (
		<MotionWrapper>
			{[1, 2, 3].map((num, _index) => (
				<LoadingShimmer height="100%" rounded key={num} />
			))}
		</MotionWrapper>
	)
}

const PageTab = ({
	label,
	isActive,
	isDraft,
	isHome = false,
}: {
	label: string
	isActive: boolean
	isDraft: boolean
	isHome?: boolean
}) => {
	return (
		<div className="font-medium relative cursor-pointer capitalize px-4 py-2 w-auto flex-none hover:bg-slate-800/25 text-slate-200 rounded-lg">
			<div className="flex items-center justify-between space-x-1 mt-[3px]">
				<span className="tracking-tight">{label}</span>
				{isHome && <Home height={16} />}
				{isDraft && !isHome && <Feather height={16} />}
			</div>
			{isActive && <ActiveIndicator />}
		</div>
	)
}

const ActiveIndicator = () => {
	return (
		<motion.span
			layoutId="active-bar"
			className="absolute mx-auto bottom-0 left-0 h-full w-full bg-slate-800/50 rounded-lg -z-10"
		/>
	)
}

// GraphQL queries
const UPDATE_PAGES_PRIORITY = gql`
	mutation UPDATE_PAGES_PRIORITY($data: UpdatePagesPriorityInput!) {
		updateSitePagesPriority(data: $data) {
			success
			message
		}
	}
`

export default PageTabs

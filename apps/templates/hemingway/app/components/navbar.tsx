import { apiEndpoint, getTemplateDeepLink, isDemoSite, siteId } from "@/config"
import { ApiResponse, GraphQLResponse } from "@/types"
import { Page, PageResponse, SiteResponse } from "@/types/generated/types"
import { gql } from "graphql-request"
import Link from "next/link"
import MorePagesModal from "./MorePages"
import NavLink from "./NavLink"
import getSideById from "@/libs/getSiteById"
import { cn } from "@/libs/cn"

const GET_ROOT_PAGE = gql`
	query ($siteId: String!) {
		data: getRootPage(siteId: $siteId) {
			success
			message
			statusCode
			data {
				name
				slug
				priority
				isPublic
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

const getRootPage = async () => {
	try {
		const response = await fetch(apiEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: GET_ROOT_PAGE,
				variables: {
					siteId: siteId,
				},
			}),
			//next: {
			//	revalidate: 2,
			//},
		})
		const finalResponse: ApiResponse<GraphQLResponse<PageResponse>> =
			await response.json()

		return finalResponse
	} catch (error) {
		console.error(error)
		return null
	}
}

const NavBar = async () => {
	const rootPage = await getRootPage()
	const site = await getSideById()

	const rootPageChildren =
		rootPage?.data?.data?.data?.children.filter(
			page => page.isPublic && page.slug !== "index"
		) ?? []

	const renderPageLinks = () => {
		/**
		 * If headerPages.length > 4, we need to show th e first 3 pages and then render MorePagesModal
		 * If headerPages.length <= 4, we need to show all pages
		 */
		if (!rootPage) return null

		if (rootPageChildren.length > 4) {
			return (
				<>
					{rootPageChildren.splice(0, 3).map(page => (
						<NavLink page={page} key={page.id} />
					))}
					<MorePagesModal pages={rootPageChildren as Page[]} />
				</>
			)
		}
		if (rootPageChildren.length <= 4) {
			return rootPageChildren?.map(page => <NavLink page={page} key={page.id} />)
		}
	}

	return (
		<nav
			className={cn(
				"flex overflow-hidden fixed top-0 right-0 left-0 justify-between items-center mx-auto w-screen lg:top-4 lg:rounded-full backdrop-blur-sm navbar lg:max-w-6xl z-[999]"
			)}>
			<div className="py-4 px-4">
				<Link href={"/"}>
					<p className="text-xl lowercase font-bold tracking-tighter text-[var(--text-color-base)]">
						{site?.data.data?.data?.textLogo}
					</p>
				</Link>
			</div>
			<div className="flex items-center px-2 space-x-2">
				{renderPageLinks()}
				{isDemoSite === "true" ? (
					<a
						rel="noreferrer"
						target="_blank"
						href={getTemplateDeepLink}
						className="py-2 px-4 text-center text-white bg-black rounded-full transition-shadow hover:shadow-lg">
						Get Template
					</a>
				) : (
					<a
						rel="noreferrer"
						href={`mailto:${site?.data.data?.data?.owner.email}`}
						className="py-2 px-4 text-center text-white bg-black rounded-full transition-shadow hover:shadow-lg">
						Contact
					</a>
				)}
			</div>
		</nav>
	)
}

export default NavBar

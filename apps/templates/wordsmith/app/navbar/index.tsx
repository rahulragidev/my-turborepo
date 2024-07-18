import { apiEndpoint, getTemplateDeepLink, isDemoSite, siteId } from "@/config"
import { ApiResponse, GraphQLResponse } from "@/types"
import { PageResponse } from "@/types/generated/types"
import { gql } from "graphql-request"
import Link from "next/link"
import MorePagesModal from "../../components/MorePages"
import NavLink from "./NavLink"
import getSideById from "@/libs/getSiteById"
import Button from "@/components/Button"
import { ArrowUpRight } from "react-feather"

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
			next: {
				revalidate: 2,
			},
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
					<MorePagesModal pages={rootPageChildren} />
				</>
			)
		}

		if (rootPageChildren.length <= 4) {
			return rootPageChildren?.map(page => <NavLink page={page} key={page.id} />)
		}
	}

	return (
		<nav className="flex flex-row justify-between items-center">
			<Link href={"/"}>
				<h6 className="uppercase">{site?.data.data?.data?.textLogo}</h6>
			</Link>

			<div className="flex items-center space-x-5 uppercase">
				<NavLink page={{ name: "Home", slug: "/" }} />
				{renderPageLinks()}
				{isDemoSite && (
					<Button asChild>
						<Link href={getTemplateDeepLink ?? "#"}>
							Get Template
							<ArrowUpRight className="ml-2" />
						</Link>
					</Button>
				)}
			</div>
		</nav>
	)
}

export default NavBar

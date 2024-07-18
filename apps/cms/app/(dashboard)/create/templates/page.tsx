import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { ChevronLeftCircle } from "lucide-react"
import Link from "next/link"
import { TemplatesResponse } from "types/generated/types"
import TemplateCard from "../components/templates-card"
import HeaderCopy from "./header-copy"
import ProceedButton from "./proceed-button"

const GET_TEMPLATES = gql`
	query GetTemplates {
		data: getTemplates {
			success
			message
			data {
				id
				name
				demoLink
				stripeProduct {
					default_price {
						currency
						unit_amount
						recurring {
							interval
						}
					}
				}
				bannerImage
				description
				creator
			}
		}
	}
`

const getAllTemplates = async () => {
	try {
		const templatesResponse = await fetchWithToken<
			GraphQLResponse<TemplatesResponse>
		>({
			query: GET_TEMPLATES,
			variables: {},
		})

		return templatesResponse.data?.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic"

const Templates = async ({
	searchParams,
}: {
	searchParams: { siteName?: string; templateId?: string }
}) => {
	// const { siteName, templateId } = searchParams
	console.log(searchParams)

	const templates = await getAllTemplates()

	return (
		<div className="relative px-8 z-0">
			<Link
				href="/create"
				className="flex items-center py-2 -ml-1 space-x-1 rounded transition-all cursor-pointer w-fit hover:bg-slate-900">
				<ChevronLeftCircle height={16} /> <span>Go Back</span>
			</Link>
			<div className="mb-12 flex items-center justify-between">
				<HeaderCopy templates={templates} />
				<ProceedButton className="hidden lg:block rounded-full" />
			</div>
			<div className="grid grid-cols-1 gap-12 py-12 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ">
				{templates.map(template => (
					<TemplateCard key={template.id} template={template} />
				))}
			</div>
			<ProceedButton className="block lg:hidden mx-auto fixed inset-x-0 bottom-8 h-fit rounded-full" />
		</div>
	)
}

export default Templates

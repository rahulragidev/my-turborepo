import { auth } from "@clerk/nextjs"
import { SITE_QUERY } from "dataHooks/useSite"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { notFound } from "next/navigation"
import { SiteResponse } from "types/generated/types"
import DangerSection from "./components/danger-section"
import DomainSection from "./components/domain-section"
import UpdateSiteLogoForm from "./components/site-logo-form"
import UpdateSiteNameForm from "./components/site-name-form"

interface Props {
	params: {
		siteId: string
	}
}

function handlGraphqlResponse<T>(
	res: GraphQLResponse<T>,
	extraChecks?: (_res: GraphQLResponse<T>) => void
): asserts res is Required<GraphQLResponse<T>> {
	if (res.status === 404) notFound()
	if (!res.data) throw new Error("No data returned from graphql")
	extraChecks?.(res)
}

const Page = async ({ params }: Props) => {
	// eslint-disable-next-line no-undef
	const { getToken } = auth()

	const res = await fetchWithToken<GraphQLResponse<SiteResponse>>({
		query: SITE_QUERY,
		getToken,
		variables: { id: params.siteId },
	})

	handlGraphqlResponse(res, r => {
		if (!r.data?.data) notFound()
	})

	const site = res.data.data!

	return (
		<>
			<UpdateSiteNameForm site={site} />
			<UpdateSiteLogoForm site={site} />
			<DomainSection site={site} />
			<DangerSection site={site} />
		</>
	)
}

export default Page

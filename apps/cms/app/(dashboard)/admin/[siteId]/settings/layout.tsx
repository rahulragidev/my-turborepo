import { auth } from "@clerk/nextjs"
import Button from "components/Button"
import Header from "components/layouts/Header"
import { SITE_QUERY } from "dataHooks/useSite"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { ChevronLeftCircle } from "lucide-react"
import { notFound } from "next/navigation"
import React from "react"
import { SiteResponse } from "types/generated/types"
import CopyToClipboard from "./components/copy-to-clipboard"

interface Props {
	children: React.ReactNode
	params: {
		siteId: string
	}
}

const Layout = async ({ children, params }: Props) => {
	const { getToken } = auth()

	const res = await fetchWithToken<GraphQLResponse<SiteResponse>>({
		query: SITE_QUERY,
		getToken,
		variables: { id: params.siteId },
	})

	if (res.status === 404 || !res.data || !res.data.data) return notFound()

	const site = res.data.data

	return (
		<>
			<Header />
			<div className="py-8 px-6 mx-auto space-y-4 w-full max-w-5xl min-h-screen">
				<Button
					href={`/${site.id}`}
					variant="tertiary"
					className="-ml-1 space-x-2 max-w-fit">
					<ChevronLeftCircle size={20} />
					<span>Back</span>
				</Button>
				<div className="space-y-4">
					<h1 className="mb-12 text-6xl text-slate-400">Settings</h1>
					<h2 className="text-3xl">{site.name}</h2>
					<div className="flex items-center space-x-1">
						<p className="text-base text-slate-400">Site Id: </p>
						<CopyToClipboard value={site.id}>
							<span>{params.siteId}</span>
						</CopyToClipboard>
					</div>

					{/* Don't show this in production */}
					{process.env.NODE_ENV !== "production" && site.vercelProjectId && (
						<div className="flex items-center space-x-1">
							<p className="text-base text-slate-400">vercelProjectId:</p>
							<CopyToClipboard value={site.vercelProjectId}>
								<span>{site.vercelProjectId}</span>
							</CopyToClipboard>
						</div>
					)}

					<div className="w-full">
						<div className="py-12 space-y-8 max-w-4xl">{children}</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Layout

"use client"

import clsx from "clsx"
import { Send } from "react-feather"
// import { ExternalLink } from "react-feather"
import { useAuth } from "@clerk/nextjs"
import useSite from "dataHooks/useSite"
import useSiteStatus from "dataHooks/useSiteStatus"
import { motion } from "framer-motion"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { ArrowUpRight } from "lucide-react"
import { useParams } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "react-hot-toast"
import { SiteStatusResponse } from "types/generated/types"
import Button from "./Button"
import LoadingShimmer from "./LoadingShimmer"
import ToolTipWrapper from "./atoms/TootlTipWraper"

const DEPLOY_SITE_MUTATION = gql`
	mutation DeploySite($siteId: String!) {
		data: deploySite(siteId: $siteId) {
			message
			success
			siteId
			status {
				createdAt
				readyState
			}
		}
	}
`

const SiteStatus = ({ className }: { className?: string }) => {
	const { getToken } = useAuth()
	const params = useParams<{ siteId: string; pageSlug: string[] }>()
	const [isLaunching, setIsLaunching] = useState(false)

	const {
		data: siteStatus,
		mutate: siteStatusMutate,
		isLoading: siteStatusIsLoading,
	} = useSiteStatus(params?.siteId as string)

	/** --------- Deploy site functions */

	const deploySite = useCallback(async () => {
		try {
			setIsLaunching(true)
			const response = await fetchWithToken<GraphQLResponse<SiteStatusResponse>>({
				query: DEPLOY_SITE_MUTATION,
				variables: {
					siteId: params?.siteId,
				},
				getToken,
			})
			if (response.data?.success) {
				siteStatusMutate()
				setIsLaunching(false)
			}
			return response
		} catch (error: any | SiteStatusResponse) {
			setIsLaunching(false)
			toast.error(error?.message || "something went wrong")
			return error || "something wrong"
		}
	}, [params?.siteId, getToken, siteStatusMutate])

	const readyStateIndicator = useCallback(() => {
		const readyState = siteStatus?.data?.data?.readyState || "Not Deployed"
		switch (readyState) {
			case "QUEUED":
				return (
					<ToolTipWrapper toolTipContent="Heavy Traffic! Our servers have you in a Queue to get updated">
						<p className="text-yellow-400">Queued For Launch</p>
					</ToolTipWrapper>
				)
			case "INITIALIZING":
				return (
					<ToolTipWrapper toolTipContent="Heavy Traffic! Our servers have you in a Queue to get updated">
						<p className="text-yellow-400">Initializing</p>
					</ToolTipWrapper>
				)
			case "BUILDING":
				return (
					<ToolTipWrapper toolTipContent="Your site is being assembled. Please wait. This should take approx 2mins">
						<p className="text-yellow-400">Building</p>
					</ToolTipWrapper>
				)
			case "ERROR":
				return (
					<ToolTipWrapper toolTipContent="Something went wrong! Please contact support@lokus.io to fix this">
						<a
							href={`mailto:support@lokus.io?subject=DeploymentError%20SiteId:${params?.siteId}&body=yo!checkthisout!`}
							className="text-red-400">
							Contact Support
						</a>
					</ToolTipWrapper>
				)
			case "READY":
				return <PageUrl pageSlug={params?.pageSlug} siteId={params?.siteId!} />

			default:
				return <p className="text-slate-400">...</p>
		}
	}, [params?.pageSlug, params?.siteId, siteStatus])

	if (siteStatusIsLoading) {
		return <LoadingShimmer />
	}

	// This needs to be User.subscription.status === "active"
	if (siteStatus?.data?.success) {
		return (
			<motion.div
				className={clsx("flex max-w-fit items-center space-x-2", className)}>
				{readyStateIndicator()}
			</motion.div>
		)
	}
	return (
		<Button loading={isLaunching} rounded onClick={() => deploySite()}>
			{!isLaunching ? (
				<>
					<Send size={14} />
					<p>Launch Site</p>
				</>
			) : (
				<p>Launching...</p>
			)}
		</Button>
	)
}

export default SiteStatus

// Page Url
const PageUrl = ({ siteId, pageSlug }: { siteId: string; pageSlug?: string[] }) => {
	const { data: siteData, isLoading: siteDataIsLoading } = useSite(siteId as string)

	if (siteDataIsLoading || !siteData) {
		return <LoadingShimmer height="16" width="24" />
	}

	const slugString = pageSlug?.join("/") ?? ""

	const url = `https://${siteData?.data?.data?.primaryDomain}/${slugString}`

	return (
		<a
			target="_blank"
			rel="noreferrer"
			href={url}
			className="flex items-center md:space-x-1 bg-slate-900 hover:bg-slate-800/75 p-2 rounded-full md:rounded">
			<span className="hidden md:block">Preview</span>
			{/* <Eye height={16} /> */}
			<ArrowUpRight height={16} className="text-green-500 md:-ml-4" />
			{/* {siteData?.data?.data?.primaryDomain} */}
			{/* {slugString ? `/${slugString}` : ""} */}
		</a>
	)
}

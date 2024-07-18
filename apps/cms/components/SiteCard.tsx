"use client"

import clsx from "clsx"
import useSiteStatus from "dataHooks/useSiteStatus"
import Link from "next/link"
import { useCallback } from "react"
import { Site } from "types/generated/types"
import LoadingShimmer from "./LoadingShimmer"
import ToolTipWrapper from "./atoms/TootlTipWraper"

type Props = {
	site: Partial<Site>
}

const containerClassName = clsx(
	"flex flex-col justify-between items-start py-8 px-4 rounded-2xl",
	"bg-slate-800 hover:bg-slate-900 ",
	"min-h-[10rem]"
)

export const SiteCardSkeleton = () => (
	<div className={containerClassName}>
		<LoadingShimmer height="0.8rem" width="100%" />
	</div>
)

const SiteCard = (props: Props) => {
	const {
		site: { id: siteId, slug },
	} = props

	// eslint-disable-next-line
	const { data: siteStatus, error } = useSiteStatus(siteId as string)

	// eslint-disable-next-line
	const readyStateLabel = useCallback(() => {
		const readyState = siteStatus?.data?.data?.readyState || "Not Deployed"
		switch (readyState) {
			case "QUEUED":
				return (
					<ToolTipWrapper toolTipContent="Heavy Traffic! Our servers have you in a Queue to get updated">
						<p className="font-mono tracking-wide text-yellow-400 uppercase">
							Queued
						</p>
					</ToolTipWrapper>
				)
			case "INITIALIZING":
				return (
					<ToolTipWrapper toolTipContent="Heavy Traffic! Our servers have you in a Queue to get updated">
						<p className="font-mono tracking-wide text-yellow-400 uppercase">
							Initializing
						</p>
					</ToolTipWrapper>
				)
			case "BUILDING":
				return (
					<ToolTipWrapper toolTipContent="Your site is being assembled. Please wait. This should take approx 2mins">
						<p className="font-mono tracking-wide text-yellow-400 uppercase">
							Building
						</p>
					</ToolTipWrapper>
				)
			case "ERROR":
				return (
					<ToolTipWrapper toolTipContent="Something went wrong! Please contact support@lokus.io to fix this">
						<a
							href={`mailto:support@lokus.io?subject=DeploymentError%20SiteId:${siteId}&body=yo!checkthisout!`}
							className="font-mono tracking-wide text-red-400 uppercase">
							Contact Support
						</a>
					</ToolTipWrapper>
				)
			case "READY":
				return (
					<ToolTipWrapper toolTipContent="Your site is Live">
						<p className="font-mono tracking-wide text-green-400 uppercase">
							Live
						</p>
					</ToolTipWrapper>
				)
			default:
				return <p className="text-slate-400">...</p>
		}
	}, [siteId, siteStatus?.data?.data?.readyState])

	if (siteStatus) {
		return (
			<Link href={`/${siteId}`} className={containerClassName}>
				<h2 className="text-2xl font-medium text-slate-300">{slug}</h2>
				{siteStatus?.data?.data ? (
					<>
						<p className="mb-4 w-full text-slate-400 truncate">
							{siteStatus?.data?.data?.domain}
						</p>
						{readyStateLabel()}
					</>
				) : (
					<p className="mb-4 text-slate-400 truncate">Not Launched</p>
				)}
			</Link>
		)
	}

	if (error) {
		return (
			<Link href={`/${siteId}`} className={containerClassName}>
				<h2 className="mb-2 text-2xl font-medium text-slate-300 truncate">
					Error
				</h2>
				<p className="inline-block py-2 px-2 my-2 rounded-md bg-slate-600">
					{error.message}
				</p>
			</Link>
		)
	}

	return <SiteCardSkeleton />
}

export default SiteCard

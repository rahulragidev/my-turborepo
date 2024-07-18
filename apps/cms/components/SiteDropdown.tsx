"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import clsx from "clsx"
import useSite from "dataHooks/useSite"
import useSiteStatus from "dataHooks/useSiteStatus"
import useUserData from "dataHooks/useUser"
import { cn } from "lib/utils"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronDownCircle } from "react-iconly"

const SiteDropdown = ({ className }: { className?: string }) => {
	const params = useParams<{ siteId: string }>()

	const siteId = params?.siteId

	const { data: siteStatus } = useSiteStatus(siteId as string)
	const { data: userData } = useUserData()
	const { data: siteData } = useSite(siteId as string)

	const domain = siteData?.data?.data?.primaryDomain

	const siteCount = userData?.data?.data?.sites?.length || 0
	const subscriptionStatus = userData?.data?.data?.subscription?.status
	// allow new site for non-active subscription or no site
	const shouldAllowNewSite = siteCount === 0 || subscriptionStatus === "active"

	const renderDomain = () => {
		if (siteStatus?.data?.success)
			return <p className="max-w-full font-mono text-xs text-green-500">{domain}</p>
		return <p>Not Launched</p>
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className={cn(
					"flex items-center justify-between py-2 px-4 space-x-2 bg-slate-800/25 hover:bg-slate-800/75 backdrop-blur-sm text-slate-400 w-fit rounded-full",
					className
				)}>
				<p className="font-medium truncate">{siteData?.data?.data?.slug}</p>
				<ChevronDownCircle size={18} />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<ScrollArea.Root>
					<ScrollArea.Viewport>
						<DropdownMenu.Content
							align="start"
							className="overflow-y-scroll rounded-lg border-2 border-solid shadow-md bg-slate-900 text-slate-400 border-slate-700/25 w-[20rem] max-h-[30vh] transition-transform z-50">
							<DropdownMenu.Item className="border-b border-solid border-slate-400/25">
								<Link
									href="/"
									className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-800">
									<ArrowLeft height={14} />
									<p>Go Back</p>
								</Link>
							</DropdownMenu.Item>
							{/* List of Existing Site */}
							{userData?.data?.data?.sites
								?.sort((a, b) => {
									if (a.id === siteId) return -1
									if (b.id === siteId) return 1
									return 0
								})
								.map((site, index) => (
									<DropdownMenu.Item
										key={site.id}
										tabIndex={index}
										className={clsx(
											"w-full",
											site.id === siteId &&
												"border-l-2 border-solid border-slate-200"
										)}>
										<Link
											href={`/${site.id}`}
											className="py-2 px-8 cursor-pointer hover:bg-slate-800/50 flex flex-col">
											<p className="font-medium">{site.slug}</p>
											{/* Show the domain if it's deployed */}
											{site.id === siteId && renderDomain()}
										</Link>
									</DropdownMenu.Item>
								))}

							{/* Create New Site */}
							{shouldAllowNewSite && (
								<DropdownMenu.Item
									asChild
									className="sticky bottom-0 border-t border-solid border-slate-600">
									<Link
										href="/create"
										className="flex items-center space-x-2 py-2 px-3 cursor-pointer text-slate-200 hover:bg-slate-800">
										<Plus height={14} />
										<span>Create New Site</span>
									</Link>
								</DropdownMenu.Item>
							)}
						</DropdownMenu.Content>
					</ScrollArea.Viewport>
				</ScrollArea.Root>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

export default SiteDropdown

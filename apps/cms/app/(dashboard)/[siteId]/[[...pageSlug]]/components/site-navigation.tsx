"use client"

import Button from "components/Button"
import SiteDropdown from "components/SiteDropdown"
import ThemeToggle from "components/ThemeToggle"
import PageTabs from "components/layouts/PageTabs"
import CreatePageButton from "components/page/CreatePageButton"
import { useMinimizeMaximize } from "contexts/MinimizeMaximizeContext"
import { motion } from "framer-motion"
import { cn } from "lib/utils"
import { Settings } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useTransition } from "react"

const SiteNavigation = () => {
	const router = useRouter()
	const params = useParams<{ siteId: string }>()
	const [isPending, startTransition] = useTransition()
	const { isMinimized } = useMinimizeMaximize()
	return (
		<motion.aside
			initial={false}
			animate={{ x: isMinimized ? "-100%" : 0 }}
			transition={{
				bounce: 0,
			}}
			className={cn(
				"flex flex-col fixed h-screen left-0 top-0 w-[80vw] md:w-[20rem] border-r-2 border-solid border-slate-800 px-4 py-8 space-y-8"
			)}>
			<SiteDropdown />
			<div className="flex-1">
				<PageTabs />
				<CreatePageButton className="rounded-lg mt-4" />
			</div>
			<Button
				loading={isPending}
				variant="tertiary"
				onClick={() => {
					startTransition(() => {
						router.push(`/admin/${params?.siteId}/settings`)
					})
				}}
				className="flex items-center p-2 cursor-pointer hover:bg-slate-800/50 rounded-lg z-0">
				{!isPending && <Settings height={16} />}
				<p>Site Settings</p>
			</Button>
			<ThemeToggle className="ml-2 w-fit" />
		</motion.aside>
	)
}
export default SiteNavigation

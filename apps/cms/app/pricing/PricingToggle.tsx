"use client"

import clsx from "clsx"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

// eslint-disable-next-line
function Tab({
	children,
	href,
	active,
	className,
}: {
	children: ReactNode
	active: boolean
	href: string
	className?: string
}) {
	return (
		<Link
			replace
			href={href}
			className={twMerge(
				clsx(`px-4 py-2`, className, {
					"dark:bg-white dark:text-black bg-black text-white": active,
				})
			)}>
			{children}
		</Link>
	)
}

const PricingToggle = () => {
	const searchParams = useSearchParams()
	const interval = searchParams?.get("interval") || "month"

	return (
		<div className="flex items-stretch rounded-lg border-2 border-solid max-w-fit border-slate-800 overflow-clip">
			<Tab
				className="rounded-r-lg"
				active={interval === "month"}
				href="?interval=month">
				Monthly
			</Tab>
			<Tab
				className="rounded-l-lg"
				href="?interval=year"
				active={interval === "year"}>
				Yearly
			</Tab>
		</div>
	)
}

export default PricingToggle

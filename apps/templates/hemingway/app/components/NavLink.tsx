"use client"

import { Page } from "@/types/generated/types"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLink = ({ page }: { page: Partial<Page> }) => {
	const pathName = usePathname()
	const { slug, name, id } = page
	const isActive = pathName === `/${slug}`
	return (
		<Link
			href={`${slug}`}
			key={id}
			className={clsx(
				"text-sm tracking-tight font-medium px-2 py-4 hover:bg-[rgba(var(--foreground-color), 0.6)] ",
				isActive && "border-b-2 border-solid border-[var(--foreground-color)]"
			)}>
			{name}
		</Link>
	)
}

export default NavLink

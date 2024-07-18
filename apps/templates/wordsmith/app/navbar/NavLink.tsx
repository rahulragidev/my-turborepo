"use client"

import { Page } from "@/types/generated/types"
import { cn } from "@/libs/cn"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLink = ({ page }: { page: Pick<Page, "name" | "slug"> }) => {
	const pathName = usePathname()
	const { slug, name } = page
	const isActive = pathName === `/${slug}`.replaceAll("//", "/")

	return (
		<Link href={`${slug}`}>
			<h6
				className={cn({
					"text-textDefault": !isActive,
					"text-primary": isActive,
				})}>
				{name}
			</h6>
		</Link>
	)
}

export default NavLink

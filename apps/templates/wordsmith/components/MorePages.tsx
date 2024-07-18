"use client"
import { cn } from "@/libs/cn"
import { Page } from "@/types/generated/types"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MorePagesModal = ({ pages }: { pages: Partial<Page>[] }) => {
	const pathname = usePathname()

	// copying pages so that we can sort them without mutating the original array
	let sortedHeaderPages = [...pages]

	// sort the pages by priority & remove the first 3 elements in the array
	sortedHeaderPages = sortedHeaderPages
		.sort((a, b) => a.priority! - b.priority!)
		.splice(3, sortedHeaderPages.length)

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button className="text-sm tracking-tight font-medium px-2 py-4 hover:opacity-70">
					More
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="flex flex-col items-start bg-[rgba(var(--background-color), 1)] rounded-lg shadow-lg min-w-[8rem] overflow-hidden"
					align="end">
					{sortedHeaderPages.map(page => (
						<Link
							href={`/${page.slug}`}
							key={page.id}
							className={cn(
								"w-full hover:bg-gray-200/50 px-4 py-2 text-sm tracking-tight",
								pathname === `/${page.slug}` &&
									"border-l-2 border-solid border-[var(--foreground-color)]"
							)}>
							{page.name}
						</Link>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

export default MorePagesModal

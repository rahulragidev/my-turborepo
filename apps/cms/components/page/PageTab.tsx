import * as AlertDialog from "@radix-ui/react-alert-dialog"
import clsx from "clsx"
import Link from "next/link"
import { useState } from "react"
// import { MoreHorizontal } from "react-feather"
import { Plus } from "react-iconly"
import { Page } from "types/generated/types"
import CustomAlertDialog from "../layouts/CustomAlertDialog"

const PageTab = (props: {
	page: Partial<Page>
	href: string
	className?: string
	isOrphan?: boolean
}) => {
	const { page, href, className, isOrphan = true } = props
	// const isOrphan = Boolean(page.children?.length! > 0)

	const [childPageName, setChildPageName] = useState("")

	return (
		<div
			className={clsx(
				"w-full flex items-center justify-between px-2 hover:bg-slate-800",
				className
			)}>
			{/* Page Link */}
			<Link
				href={href as string}
				key={page.id}
				className={clsx(
					"flex flex-auto tracking-wide truncate py-2 px-2 capitalize rounded"
					// !isOrphan && "pl-6"
				)}>
				{page.name}
			</Link>
			{isOrphan && (
				<div className="flex items-center justify-end">
					{/* Plus Icon to add a new child */}
					<CustomAlertDialog
						triggerButton={
							<button type="button" className="button text rounded-full">
								<Plus size="medium" />{" "}
							</button>
						}>
						<AlertDialog.Title className="text-black">
							What&apos;s the name of the page?
						</AlertDialog.Title>

						<input
							name="childPageName"
							onChange={e => setChildPageName(e.target.name)}
							type="text"
							placeholder="Enter name"
							value={childPageName}
							className=""
						/>

						<div className="flex justify-end space-x-2 w-full">
							<AlertDialog.Cancel>
								<button type="button" className="button text">
									Cancel
								</button>
							</AlertDialog.Cancel>

							<AlertDialog.Action>
								<button
									type="submit"
									className="button filled flex itesm-center space-x-2">
									<Plus size="medium" />{" "}
									<span className="mt-[2px]">Create Page</span>
								</button>
							</AlertDialog.Action>
						</div>
					</CustomAlertDialog>
					{/* Chevron to indicate that it has children */}
					{/* {isOrphan && ( */}
					{/* <IconButton onClick={() => onExpandClick()}>
						{showingChildren ? (
							<ChevronDown size="medium" filled />
						) : (
							<ChevronLeft size="medium" filled />
						)}
					</IconButton> */}
					{/* )} */}
				</div>
			)}
			{/* More Options  */}
			{/* <div className="flex items-center justify-end space-x-4">
				<IconButton onClick={() => console.log("More Options")}>
					<MoreHorizontal height="16" />
				</IconButton>
			</div> */}
		</div>
	)
}

export default PageTab

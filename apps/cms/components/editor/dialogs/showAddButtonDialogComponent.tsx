import { Editor, Range } from "@tiptap/core"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import useAllPagesBySite from "dataHooks/useAllPagesBySite"
import { useCallback } from "react"
import * as ReactDOMClient from "react-dom/client"
import { Page } from "types/generated/types"

const AddButtonDialogComponent = ({
	range,
	editor,
	onClose,
}: {
	range: Range
	editor: Editor
	onClose: () => void
}) => {
	//@ts-ignore
	const siteId = editor?.options?.editorProps?.attributes?.siteId as string
	const { data } = useAllPagesBySite(siteId)

	debugger

	const addButton = useCallback((page: Page) => {
		editor
			.chain()
			.focus()
			.setButton({
				href: page.slug,
				inline: false,
				target: "",
				variant: "primary",
				text: page.name ?? page.slug,
			})
			.run()
		onClose()
	}, [])

	return (
		<CustomDialogBox open>
			<h2>Select a Page</h2>
			<ul>
				{data?.data?.data
					?.filter(page => page.name !== "root")
					.map(page => (
						<ul className="w-full">
							<li key={page.id}>
								<button
									type="button"
									onClick={() => addButton(page)}
									className="w-full px-4 py-2 hover:bg-slate-800/50">
									<div className="text-left">
										<p className="text-base font-semibold">
											{page.name}
										</p>
										<span className="block font-mono text-sm">
											/{page.slug}
										</span>
									</div>
								</button>
							</li>
						</ul>
					))}
			</ul>
		</CustomDialogBox>
	)
}

const showButtonDialog = (editor: Editor, range: Range) => {
	const container = document.getElementById("dialog-portal") as HTMLElement
	const buttonRoot = ReactDOMClient.createRoot(container)
	console.log("Range in showButtonDialog", range)

	buttonRoot.render(
		<AddButtonDialogComponent
			range={range}
			editor={editor}
			onClose={() => buttonRoot.unmount()}
		/>
	)

	// unmount and clean up when necessary
	return () => {
		buttonRoot.unmount()
	}
}

export default showButtonDialog

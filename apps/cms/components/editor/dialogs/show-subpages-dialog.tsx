import { Editor, Range } from "@tiptap/core"
import * as ReactDOMClient from "react-dom/client"
import AddSubPageDialogComponent from "./AddSubPageDialogComponent"

// Function to be called from Vanilla JS
const showSubpagesDialog = (
	editor: Editor, // onAdd is a function that takes a string argument and returns void
	range: Range
) => {
	const container = document.getElementById("dialog-portal") as HTMLElement
	const subpagesRoot = ReactDOMClient.createRoot(container) // Create a root.
	console.log("Range in showSubpagesDialog", range)

	subpagesRoot.render(
		<AddSubPageDialogComponent
			range={range}
			editor={editor}
			onClose={() => subpagesRoot.unmount()}
		/>
	)
	// You should also expose a way to unmount and clean up when necessary
	return () => {
		subpagesRoot.unmount()
	}
}
export default showSubpagesDialog

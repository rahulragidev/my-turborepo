import { Editor } from "@tiptap/core"
import * as ReactDOMClient from "react-dom/client"
import AddYoutubeDialogComponent from "./AddYoutubeDialogComponent"

// Function to be called from Vanilla JS
const showYoutubeDialog = (
	editor: Editor // onAdd is a function that takes a string argument and returns void
) => {
	const container = document.createElement("div")
	document.body.appendChild(container)
	const root = ReactDOMClient.createRoot(container) // Create a root.

	root.render(
		<AddYoutubeDialogComponent editor={editor} onClose={() => root.unmount()} />
	)
	// You should also expose a way to unmount and clean up when necessary
	return () => {
		root.unmount()
	}
}
export default showYoutubeDialog

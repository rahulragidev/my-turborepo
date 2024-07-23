"use client"

import { Editor } from "@tiptap/core"
import Button from "components/Button"
import ButtonWithFeedback from "components/button-with-feedback"
import { cn } from "lib/utils"
import { useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { createSubPage } from "./actions"

const CreateSubPageForm = ({
	parentId,
	siteId,
	editor,
	onClose,
}: {
	parentId: string
	siteId: string
	editor: Editor
	onClose: () => void
}) => {
	// formAction is the method. state is the response from the method
	const [state, formAction] = useFormState(createSubPage, null)
	const { pending } = useFormStatus()

	useEffect(() => {
		// looking for changes to state
		if (state === null) return
		console.log("state", state)

		if (!state.success) {
			toast.error(state.message)
		} else {
			toast.success(state.message)
			if (state.data) {
				const page = state.data
				if (!page) throw new Error("No page data returned.")
				console.log("new page", page)

				const canInsertPageNode = editor.can().insertContent({
					type: "page-node",
					attrs: { id: page.id, slug: page.slug, name: page.name },
				})
				if (!canInsertPageNode) {
					throw new Error("Editor Cannot Add a page node.")
				}
				editor
					.chain()
					.focus()
					.setPage({
						id: page.id as string,
						slug: page.slug as string,
						name: page.name as string,
					})
					.enter()
					.run()
				// setIsCreating(false)
				onClose()
			}
		}
	}, [state])

	const inputClass = cn("w-full p-2 border border-slate-600 rounded-md")

	return (
		<form action={formAction} className="p-6 space-y-4 h-full">
			<h2 className="text-2xl font-medium tracking-tight ml-2">Add Sub Page</h2>
			<input type="text" name="parent" value={parentId} hidden />
			<input type="text" name="siteId" value={siteId} hidden />
			<div className="w-full">
				<label htmlFor={"name"} className="ml-2 text-lg">
					Name
				</label>
				<input
					type="text"
					name="name"
					required
					className={inputClass}
					placeholder="Name"
				/>
			</div>
			<div className="flex items-center justify-end gap-2">
				<Button variant="tertiary" type={"button"} onClick={() => onClose()}>
					<span>Cancel</span>
				</Button>
				<ButtonWithFeedback type="submit">
					<span>Create Sub Page</span>
				</ButtonWithFeedback>
			</div>
		</form>
	)
}

export default CreateSubPageForm

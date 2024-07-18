import { Editor } from "@tiptap/core"
import Button from "components/Button"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import { useCallback, useState } from "react"

const AddYoutubeDialogComponent = ({
	editor,
	defaultOpen = true,
	onClose,
}: {
	editor: Editor
	defaultOpen?: boolean
	onClose: () => void
}) => {
	const [open, setOpen] = useState(defaultOpen)
	const [youtubeLink, setYoutubeLink] = useState("")

	const handleCancel = useCallback(() => {
		onClose()
		setOpen(false)
	}, [onClose])

	const handleConfirm = useCallback(() => {
		// add to editor and close the dialog
		editor
			.chain()
			.focus()
			.setYoutubeVideo({
				src: youtubeLink,
			})
			.run()
		onClose()
		setOpen(false)
	}, [editor, onClose, youtubeLink])

	return (
		<CustomDialogBox open={open} onOpenChange={open => setOpen(open)}>
			<div className="flex flex-col space-y-4 p-8">
				<div className="mb-8">
					<h2 className="text-xl text-slate-200">YouTube™ Link</h2>
					<p className="text-slate-500">
						Please paste a YouTube™ link to add to your page
					</p>
				</div>
				<input
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus
					id="youtube-input"
					className="input"
					placeholder="https://www.youtube.com/xxxx/xxxx"
					type="text"
					onChange={e => setYoutubeLink(e.target.value)}
				/>
				<div className="w-full flex items-center justify-end space-x-4">
					<Button variant="secondary" onClick={() => handleCancel()}>
						Cancel
					</Button>
					<Button onClick={() => handleConfirm()}>Add</Button>
				</div>
			</div>
		</CustomDialogBox>
	)
}

export default AddYoutubeDialogComponent

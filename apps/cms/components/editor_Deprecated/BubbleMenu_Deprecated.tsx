import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { BubbleMenu, Editor } from "@tiptap/react"
import clsx from "clsx"
import Button from "components/Button"
import CustomAlertDialog from "components/layouts/CustomAlertDialog"
import { Bold, Italic, Link2 } from "lucide-react"
import NextImage from "next/image"
import { useState } from "react"

const BubbleMenuComponent = ({ editor }: { editor: Editor }) => {
	const [openLinkModal, setOpenLinkModal] = useState(false)
	const [link, setLink] = useState<string | undefined>(undefined)
	const toggleLink = () => {
		if (!editor!.isActive("link")) {
			if (link) {
				editor!.chain().focus().setLink({ href: link, target: "_blank" }).run()
			}
		} else {
			editor!.chain().focus().unsetLink().run()
		}
		setOpenLinkModal(false)
	}
	return (
		<BubbleMenu
			className="bubble-menu"
			tippyOptions={{
				duration: 100,
				popperOptions: { placement: "left-start" },
			}}
			pluginKey="bubbleMenuOne"
			// shouldShow={() => true}
			shouldShow={({ editor, state }) => {
				// only show the bubble if paragraph is selected
				return (
					(editor.isActive("paragraph") || editor.isActive("heading")) &&
					!state.selection.empty
				)
			}}
			editor={editor}>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={editor.isActive("bold") ? "is-active" : ""}
				aria-label="Toggle Bold Text">
				<Bold />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={editor.isActive("italic") ? "is-active" : ""}
				aria-label="Toggle Italic Text">
				<Italic />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={clsx(
					editor.isActive("strike") ? "is-active" : "",
					"text-white"
				)}
				aria-label="Toggle Strikethrough Text">
				<NextImage
					className="text-white"
					src="/icons/strikethrough.svg"
					height={16}
					width={16}
					alt=""
				/>
			</button>
			<CustomAlertDialog
				open={openLinkModal}
				onOpenChange={setOpenLinkModal}
				triggerButton={
					<button
						aria-label="Toggle Link"
						type="button"
						onClick={() => toggleLink()}
						className={editor.isActive("strike") ? "is-active" : ""}>
						<Link2 />
					</button>
				}>
				<AlertDialog.Title className="text-slate-400 text-xl font-medium tracking-tight">
					{" "}
					Enter Url
				</AlertDialog.Title>
				<input
					aria-label="Enter Url"
					placeholder="https://www.something.com"
					className="w-full border border-slate-500 rounded-md px-3 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent "
					onChange={e => setLink(e.target.value)}
				/>
				<div className="w-full flex items-center justify-end py-4 space-x-4">
					<AlertDialog.Cancel>
						<Button variant="tertiary">Cancel</Button>
					</AlertDialog.Cancel>
					<Button variant="primary" onClick={() => toggleLink()}>
						Done
					</Button>
				</div>
			</CustomAlertDialog>

			<button
				aria-label="Toggle Blockquote"
				type="button"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={editor.isActive("blockquote") ? "is-active" : ""}>
				<NextImage
					className="text-white"
					src="/icons/single-quotes-l.svg"
					height={24}
					width={24}
					alt=""
				/>
			</button>
			<button
				aria-label="Toggle Code Block"
				type="button"
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={editor.isActive("code") ? "is-active" : ""}>
				<NextImage
					className="text-white"
					src="/icons/code-view.svg"
					height={24}
					width={24}
					alt=""
				/>
			</button>
			<button
				aria-label="Toggle Bullet List"
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive("bullet-list") ? "is-active" : ""}>
				<NextImage
					className="text-white"
					src="/icons/list-unordered.svg"
					height={24}
					width={24}
					alt=""
				/>
			</button>
			<button
				aria-label="Toggle Ordered List"
				type="button"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive("ordered-list") ? "is-active" : ""}>
				<NextImage
					className="text-white"
					src="/icons/list-ordered.svg"
					height={24}
					width={24}
					alt=""
				/>
			</button>
		</BubbleMenu>
	)
}

export default BubbleMenuComponent

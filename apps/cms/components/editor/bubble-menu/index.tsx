/* eslint-disable jsx-a11y/control-has-associated-label */
import { BubbleMenu, BubbleMenuProps, isNodeSelection } from "@tiptap/react"
import { cn } from "lib/utils"
import {
	BoldIcon,
	CodeIcon,
	ItalicIcon,
	StrikethroughIcon,
	UnderlineIcon,
} from "lucide-react"
import { FC, useState } from "react"
import AISelector from "./ai-selector"
import NodeSelector from "./node-selector"
// import { ColorSelector } from "./color-selector";
import { BubbleMenuItem } from "./bubble-menu-item.interface"
import LinkSelector from "./link-selector"

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">

const EditorBubbleMenu: FC<EditorBubbleMenuProps> = props => {
	const { editor } = props
	const items: BubbleMenuItem[] = [
		{
			name: "bold",
			isActive: () => editor!.isActive("bold"),
			command: () => editor!.chain().focus().toggleBold().run(),
			icon: BoldIcon,
		},
		{
			name: "italic",
			isActive: () => editor!.isActive("italic"),
			command: () => editor!.chain().focus().toggleItalic().run(),
			icon: ItalicIcon,
		},
		{
			name: "underline",
			isActive: () => editor!.isActive("underline"),
			command: () => editor!.chain().focus().toggleUnderline().run(),
			icon: UnderlineIcon,
		},
		{
			name: "strike",
			isActive: () => editor!.isActive("strike"),
			command: () => editor!.chain().focus().toggleStrike().run(),
			icon: StrikethroughIcon,
		},
		{
			name: "code",
			isActive: () => editor!.isActive("code"),
			command: () => editor!.chain().focus().toggleCode().run(),
			icon: CodeIcon,
		},
	]

	const bubbleMenuProps: EditorBubbleMenuProps = {
		...props,
		shouldShow: ({ state, editor }) => {
			const { selection } = state
			const { empty } = selection

			// don't show bubble menu if:
			// - the selected node is an image
			// - the selection is empty
			// - the selection is a node selection (for drag handles)
			if (editor.isActive("image") || empty || isNodeSelection(selection)) {
				return false
			}
			return true
		},
		tippyOptions: {
			moveTransition: "transform 0.15s ease-out",
			onHidden: () => {
				setIsAISelectorOpen(false)
				setIsNodeSelectorOpen(false)
				// setIsColorSelectorOpen(false);
			},
		},
	}

	const [isAISelectorOpen, setIsAISelectorOpen] = useState(false)
	const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false)
	// const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
	return (
		<BubbleMenu
			{...bubbleMenuProps}
			className="flex w-fit divide-x divide-slate-500/50 border border-solid border-slate-500/50 rounded bg-slate-950 shadow-xl transition-all ease-in">
			<AISelector
				editor={editor!}
				isOpen={isAISelectorOpen}
				setIsOpen={() => {
					setIsAISelectorOpen(!isAISelectorOpen)
					// setIsColorSelectorOpen(false);
					setIsNodeSelectorOpen(false)
				}}
			/>
			<NodeSelector
				editor={editor!}
				isOpen={isNodeSelectorOpen}
				setIsOpen={() => {
					setIsNodeSelectorOpen(!isNodeSelectorOpen)
					setIsAISelectorOpen(false)
					// setIsColorSelectorOpen(false);
				}}
			/>
			<LinkSelector editor={editor!} />
			<div className="flex">
				{items.map(item => (
					<button
						key={item.name}
						onClick={item.command}
						className="p-2 text-slate-200 hover:bg-slate-800 active:bg-slate-200"
						type="button">
						<item.icon
							className={cn("h-4 w-4", {
								"text-blue-500": item.isActive(),
							})}
						/>
					</button>
				))}
			</div>
			{/* <ColorSelector
        editor={editor!}
        isOpen={isColorSelectorOpen}
        setIsOpen={() => {
          setIsColorSelectorOpen(!isColorSelectorOpen);
          setIsAISelectorOpen(false);
          setIsNodeSelectorOpen(false);
          setIsLinkSelectorOpen(false);
        }}
      /> */}
		</BubbleMenu>
	)
}

export default EditorBubbleMenu

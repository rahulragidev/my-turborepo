import { Node, NodeViewProps, SingleCommands } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { cn } from "lib/utils"

interface SetButtonOptions {
	inline: boolean
	href: string
	target: string
	variant: "primary" | "secondary" | "tertiary"
	text: string
}

declare module "@tiptap/core" {
	// eslint-disable-next-line
	interface Commands<ReturnType> {
		button: {
			/**
			 * Insert a Button
			 */
			// eslint-disable-next-line no-unused-vars
			setButton: (options: SetButtonOptions) => ReturnType
			/**
			 * Unset a Button
			 */
			unsetButton: () => ReturnType
		}
	}
}

const ButtonNodeView = (props: NodeViewProps) => {
	const { editor, node, getPos, updateAttributes } = props
	const siteId =
		typeof editor.options?.editorProps?.attributes === "object"
			? (editor.options.editorProps.attributes.siteId as string)
			: ""

	// see if the editor's cusor is inside the button node
	const isActive = editor.isActive("button", { id: node.attrs.id })
	console.log("Button Node View Attrs:", node.attrs)

	// code to exit node
	return (
		<NodeViewWrapper
			as={"button"}
			onClick={() => {
				window.location.href = `${siteId}/${node.attrs.href}`
			}}
			className={cn(
				"focus:ring-2 ring-blue-800 ring-offset-2 px-4 py-3 text-2xl rounded-full bg-slate-100 text-slate-800 shadow-sm hover:bg-slate-200 cursor-pointer",
				isActive && "ring-2 ring-blue-400 ring-offset-2"
			)}>
			{node.attrs.text}
		</NodeViewWrapper>
	)
}

const ButtonNode = Node.create({
	name: "button",

	group: "inline",

	inline: true,

	selectable: false,

	atom: true,

	addAttributes() {
		return {
			href: {
				default: null,
			},
			target: {
				default: null,
			},
			rel: {
				default: null,
			},
			text: {
				default: "Click me!",
			},
			variant: {
				default: "primary",
			},
		}
	},

	//addKeyboardShortcuts() {
	//	return {
	//		Enter: () => {
	//			// const nodeAfter = this.editor.view.state.selection.$to.nodeAfter
	//			// current range
	//			const positionNodeAfter = this.editor.view.state.selection.$to.pos
	//			// const range = this.editor.view.state.selection
	//			console.log("enter hit on custome node:", this.name)
	//			return this.editor.chain().focus(positionNodeAfter).run()
	//		},
	//	}
	//},

	parseHTML() {
		return [
			{
				tag: "button",
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ["button", HTMLAttributes, 0]
	},

	addCommands() {
		return {
			setButton:
				options =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: {
							...options,
						},
					})
				},

			unsetButton:
				() =>
				({ commands }: { commands: SingleCommands }) => {
					return commands.setNode("paragraph")
				},
		}
	},

	addNodeView() {
		return ReactNodeViewRenderer(ButtonNodeView)
	},
})

export default ButtonNode

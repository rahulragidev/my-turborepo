import { Editor, Extension, Range, ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import tippy from "tippy.js"
import CommandDropdownList from "./CommandDropdownList_Deprecated"
import getSuggestionItems from "./getSuggestionItems_Deprecated"

// Step 1: Create an Extension for the Slash Command with basic options
const BasicCommandExtension = Extension.create({
	// Give it a name
	name: "slash-command",
	addOptions() {
		return {
			suggestion: {
				char: "/",
				command: ({
					editor,
					range,
					props,
				}: {
					editor: Editor
					range: Range
					props: any
				}) => {
					props.command({ editor, range })
				},
			},
		}
	},
	// Add the suggestion Plugin from ProseMirror
	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
			}),
		]
	},
})

const renderItems = () => {
	let component: ReactRenderer | null = null
	let popup: any

	return {
		onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
			component = new ReactRenderer(CommandDropdownList, {
				props,
				editor: props.editor,
			})
			// @ts-ignore
			popup = tippy("body", {
				getReferenceClientRect: props.clientRect,
				appendTo: () => document.body,
				content: component.element,
				showOnCreate: true,
				interactive: true,
				trigger: "manual",
				placement: "bottom-start",
				popperOptions: {
					zIndex: 100,
				},
			})
		},
		onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
			component?.updateProps(props)
			popup[0].setProps({
				getReferenceClientRect: props.clientRect,
			})
		},
		onKeyDown: (props: { event: KeyboardEvent }) => {
			if (props.event.key === "Escape") {
				popup?.[0].hide()
				return true
			}
			if (props.event.key === "Enter") {
				popup?.[0].hide()
				// @ts-ignore
				return component?.ref?.onKeyDown(props)
			}
			// @ts-ignore
			return component?.ref?.onKeyDown(props)
		},
		onExit: () => {
			popup?.[0].destroy()
			component?.destroy()
		},
	}
}

// Add Suggestions on top of the BasicCommandExtension
const SlashCommand = BasicCommandExtension.configure({
	suggestion: {
		items: getSuggestionItems,
		render: renderItems,
	},
})

export default SlashCommand

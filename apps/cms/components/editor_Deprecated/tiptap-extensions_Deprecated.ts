import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Youtube from "@tiptap/extension-youtube"
import StarterKit from "@tiptap/starter-kit"
import PageNodeExtension from "../editor/extensions/page-node"
import CustomImageExtension from "./image-node-extension_Deprecated/CustomImageExtension"
import SlashCommand from "./slash-commands_Deprecated/SlashCommand_Deprecated"

const TiptapExtensions = [
	StarterKit,
	// Document.extend({
	// 	content: "page-node",
	// })
	// Image Extension
	CustomImageExtension,
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === "heading") {
				return `Heading ${node.attrs.level}`
			}
			return "Press '/' for commands, or '++' for AI autocomplete..."
		},
		includeChildren: true,
		showOnlyWhenEditable: false,
	}),
	Link.configure({
		HTMLAttributes: {
			class: "underline text-darkblue-800 hover:opacity-50",
		},
		linkOnPaste: true,
		openOnClick: false,
	}),
	SlashCommand,
	// Commands.configure({
	// 	suggestion,
	// }),
	Youtube.configure({
		modestBranding: true,
		progressBarColor: "blue",
		HTMLAttributes: {
			class: "w-full rounded-xl",
		},
	}),
	PageNodeExtension,
]

export default TiptapExtensions

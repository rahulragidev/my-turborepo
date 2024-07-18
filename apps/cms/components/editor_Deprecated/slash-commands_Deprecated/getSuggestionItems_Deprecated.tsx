import { Editor, Range } from "@tiptap/react"
import {
	ArrowUpLeftFromCircle,
	Code,
	FilePlus2,
	Heading1,
	Heading2,
	Heading3,
	ImagePlus,
	ListOrdered,
	QuoteIcon,
	Sparkles,
	Youtube,
} from "lucide-react"
import { ReactNode } from "react"
import { List } from "react-feather"

export interface SlashCommandItem {
	category: "text" | "media" | "blocks" | "ai" | "other"
	title: string
	description: string
	searchTerms?: string[]
	command?: ({
		// eslint-disable-next-line no-unused-vars
		editor,
		// eslint-disable-next-line no-unused-vars
		range,
		// eslint-disable-next-line no-unused-vars
		data,
	}: {
		editor: Editor
		range: Range
		data: any
	}) => void
	icon?: ReactNode
}

const getSuggestionItems = ({ editor, query }: { editor: Editor; query: string }) => {
	// Define the available commands
	const items: SlashCommandItem[] = [
		{
			category: "text",
			title: "Continue writing",
			description: "Use AI to expand your thoughts.",
			searchTerms: ["gpt"],
			icon: <Sparkles size={16} />,
			// command: ({ editor, range }: { editor: Editor; range: Range }) => {
			// 	editor.chain().focus().deleteRange(range).run()
			// },
		},
		// Heading 1 command
		{
			category: "text",
			title: "Heading 1",
			description: "Big Section Heading",
			searchTerms: ["heading", "title", "h1"],
			icon: <Heading1 size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode("heading", { level: 1 })
					.run()
			},
			// icon: <Heading1 size={16}  />
		},
		// Heading 2 command
		{
			category: "text",
			title: "Heading 2",
			description: "Medium Section Heading",
			searchTerms: ["heading", "title", "h2"],
			icon: <Heading2 size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode("heading", { level: 2 })
					.run()
			},
		},
		// Heading 3 command
		{
			category: "text",
			title: "Heading 3",
			description: "Small Section Heading",
			searchTerms: ["heading", "title", "h3"],
			icon: <Heading3 size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.setNode("heading", { level: 3 })
					.run()
			},
		},
		// Blockquote toggle command
		{
			category: "text",
			title: editor.isActive("blockquote") ? "Remove Blockquote" : "Blockquote",
			description: "Quote a block of text",
			searchTerms: ["quote", "blockquote"],
			icon: <QuoteIcon size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleBlockquote().run()
			},
		},
		// Code block toggle command
		{
			category: "text",
			title: "Code",
			description: "Code block",
			searchTerms: ["code", "pre"],
			icon: <Code size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
			},
		},
		// Bullet list toggle command
		{
			category: "text",
			title: "Bullet List",
			description: "Bullter points",
			searchTerms: ["bullet", "ul", "list"],
			icon: <List size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleBulletList().run()
			},
		},
		// Ordered list toggle command
		{
			category: "text",
			title: "Numbered List",
			description: "Numbered List",
			searchTerms: ["number", "ol", "list"],
			icon: <ListOrdered size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).toggleOrderedList().run()
			},
		},
		// Image command
		{
			category: "media",
			title: "Image",
			description: "Upload an image from your computer",
			searchTerms: ["image", "img", "upload", "picture"],
			icon: <ImagePlus size={16} />,
			command: props => {
				console.log("Image command triggered with props", props)
				// Don't do anything here. Just handle all the things in the CommandDropdownList.tsx component
			},
		},
		// Image command
		{
			category: "media",
			title: "YouTube",
			description: "Embed a YouTube video",
			searchTerms: ["youtube", "video", "embed"],
			icon: <Youtube size={16} />,
			command: props => {
				console.log("YOUTUBE command triggered with props", props)
				// Don't do anything here. Just handle all the things in the CommandDropdownList.tsx component
			},
		},
		{
			category: "blocks",
			title: "Page",
			description: "Add a child page or link to another page",
			searchTerms: ["page", "link"],
			icon: <FilePlus2 size={16} />,
			command: props => {
				console.log("PAGE command triggered with props", props)
			},
		},
		// Exit command
		{
			category: "other",
			title: "exit",
			description: "Exit ",
			searchTerms: ["exit", "quit"],
			icon: <ArrowUpLeftFromCircle size={16} />,
			command: ({ editor, range }: { editor: Editor; range: Range }) => {
				editor.chain().focus().deleteRange(range).run()
			},
		},
	]
	// Based on the query, filter the matching strings and show them in the dropdown
	return items.filter(item => {
		if (typeof query === "string" && query.length > 0) {
			const search = query.toLowerCase()
			return (
				item.title.toLowerCase().includes(search) ||
				item.description.toLowerCase().includes(search) ||
				(item.searchTerms &&
					item.searchTerms.some((term: string) => term.includes(search)))
			)
		}
		return true
	})
}

export default getSuggestionItems

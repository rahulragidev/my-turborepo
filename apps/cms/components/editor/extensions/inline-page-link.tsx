import { Node, NodeViewRendererProps } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { FeatherIcon } from "lucide-react"
import Link from "next/link"

export interface PageReferenceOptions {
	href: string
	name: string
	HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		inlinePageLink: {
			/**
			 * Set a highlight mark
			 */
			addPageLink: (attributes?: {
				href: string
				name: string
				isPublic: boolean
			}) => ReturnType
		}
	}
}

const InlinePageLinkNodeView = (props: NodeViewRendererProps) => {
	const { editor } = props
	// @ts-expect-error
	const siteId = editor.options?.editorProps?.attributes?.siteId as string
	return (
		<NodeViewWrapper className="inline-flex items-center space-x-2 w-fit px-2 py-1 bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-md transition-none hover:shadow-md">
			<Link href={`/${siteId}/${props.node.attrs.href}`}>
				{props.node.attrs.name}
			</Link>
			{!props.node.attrs.isPublic && <FeatherIcon height={14} />}
		</NodeViewWrapper>
	)
}

const InlinePageLink = Node.create<PageReferenceOptions>({
	name: "inline-page-link",

	group: "inline",

	inline: true,

	selectable: false,

	atom: true,

	addAttributes() {
		return {
			href: {
				default: null,
			},
			name: {
				default: null,
			},
			HTMLAttributes: {
				class: "text-blue-800 bg-blue-100 p-1 rounded-md",
			},
			isPublished: {
				default: false,
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: `a[data-type="inline-page-reference-mark"]`,
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"a",
			{
				"data-type": "inline-page-reference-mark",
				...HTMLAttributes,
			},
			0,
		]
	},

	addCommands() {
		return {
			addPageLink:
				attributes =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: attributes,
					})
				},
		}
	},

	addNodeView() {
		return ReactNodeViewRenderer(InlinePageLinkNodeView)
	},
})

export default InlinePageLink

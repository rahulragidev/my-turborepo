import { Node, NodeViewRendererProps } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
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
			addPageLink: (attributes?: { href: string; name: string }) => ReturnType
		}
	}
}

const InlinePageLinkNodeView = (props: NodeViewRendererProps) => {
	return (
		<NodeViewWrapper className="inline w-fit p-1 underline-offset-2 underline hover:underline-offset-4 transition-all ">
			<Link className="!no-underline" href={`/${props.node.attrs.href}`}>
				{props.node.attrs.name}
			</Link>
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

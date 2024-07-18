import { Node } from "@tiptap/core"
import {
	NodeViewWrapper,
	NodeViewWrapperProps,
	ReactNodeViewRenderer,
} from "@tiptap/react"
import Link from "next/link"

type SetFeaturedPageCardOptions = {
	id: string
	slug: string
	name: string
	description?: string
	bannerImage?: string
}

declare module "@tiptap/core" {
	// eslint-disable-next-line
	interface Commands<ReturnType> {
		featuredPageCard: {
			/**
			 * Insert featuredPages section
			 */
			// eslint-disable-next-line no-unused-vars
			setFeaturedPageCard: (options: SetFeaturedPageCardOptions) => ReturnType
		}
	}
}

const FeaturedCardComponent = (props: NodeViewWrapperProps) => {
	const { node, editor } = props
	const siteId = editor.options.editorProps.attributes.siteId as string
	console.log("FeaturedCardComponent node:", node)
	const { name, description, slug } = node.attrs
	return (
		<NodeViewWrapper data-type="featured-card-node" className="w-full">
			<Link href={`/${siteId}/${slug}`}>
				{/* {featuredImage && <Image src={featuredImage} alt={name} />} */}
				<h3>{name}</h3>
				{description && <p>{description}</p>}
			</Link>
		</NodeViewWrapper>
	)
}

const FeaturedCardNode = Node.create({
	name: "featured-card-node",
	group: "block",
	content: "block*",

	addAttributes() {
		return {
			...this.parent?.(),
			id: {
				default: "",
			},
			name: {
				default: "",
			},
			slug: {
				default: "",
			},
			description: {
				default: "",
			},
			bannerImage: {
				default: "",
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="featured-card-node"]',
				getAttrs: dom => {
					if (dom instanceof HTMLElement) {
						return {
							id: dom.getAttribute("data-id"),
							name: dom.getAttribute("data-name"),
							description: dom.getAttribute("data-description"),
							slug: dom.getAttribute("data-slug"),
							bannerImage: dom.getAttribute("data-banner-image"),
						}
					}
					return {}
				},
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		const { id, name, description, slug, bannerImage } = HTMLAttributes

		return [
			"div",
			{
				"data-type": "featured-card-node",
				"data-id": id,
				"data-name": name,
				"data-description": description,
				"data-slug": slug,
				"data-banner-image": bannerImage,
			},
			0,
			// [
			//	"h2",
			//	{
			//		class: "text-2xl font-bold",
			//	},
			//	name,
			// ],
		]
	},

	addCommands() {
		return {
			setFeaturedPageCard:
				options =>
				({ commands }) => {
					// console.log("setFeaturedCard options:", options)
					return commands.insertContent({
						type: this.name,
						attrs: options,
					})
				},
		}
	},

	addNodeView() {
		return ReactNodeViewRenderer(FeaturedCardComponent)
	},
})

export default FeaturedCardNode

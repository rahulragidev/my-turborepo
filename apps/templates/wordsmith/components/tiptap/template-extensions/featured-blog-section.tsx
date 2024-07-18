import { Node } from "@tiptap/core"

// Extensions
const FeaturedBlogsSectionExtension = Node.create({
	name: "featured-blogs",

	group: "block",

	content: "block*",

	parseHTML() {
		return [
			{
				tag: '*[data-type="featured-blogs"]',
			},
		]
	},

	renderHTML() {
		return ["div", { "data-type": "featured-blogs" }, 0]
	},
})

export default FeaturedBlogsSectionExtension

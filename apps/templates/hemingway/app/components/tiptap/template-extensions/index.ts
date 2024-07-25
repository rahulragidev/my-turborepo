import StarterKit from "@tiptap/starter-kit"
import FeaturedBlogsSectionExtension from "./featured-blog-section"
import FeaturedCardNode from "./featured-card-node"
import ButtonNode from "./button-node"
import InlinePageLink from "./inline-page-link"
import TiptapLink from "@tiptap/extension-link"
import TiptapImage from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"

const templateExtensions = [
	StarterKit,
	FeaturedBlogsSectionExtension,
	FeaturedCardNode,
	ButtonNode,
	InlinePageLink,
	TiptapLink,
	TiptapImage,
	Youtube.configure({
		modestBranding: true,
		progressBarColor: "blue",
		HTMLAttributes: {
			class: "w-full rounded-xl focus:border-2 focus:border-blue-500",
		},
	}),
]

export default templateExtensions

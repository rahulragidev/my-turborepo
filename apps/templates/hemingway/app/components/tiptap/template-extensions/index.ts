import StarterKit from "@tiptap/starter-kit"
import FeaturedBlogsSectionExtension from "@repo/tiptap-custom-extensions/featured-blogs"
import FeaturedCardNode from "./featured-card-node"
import ButtonNode from "@repo/tiptap-custom-extensions/button-node"
import InlinePageLink from "@repo/tiptap-custom-extensions/inline-page-link"
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

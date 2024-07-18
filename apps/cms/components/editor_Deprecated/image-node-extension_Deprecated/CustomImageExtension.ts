import Image from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"
import NextImageWrapper from "./NextImageWrapper"

const CustomImageExtension = Image.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			blurDataURL: {
				default: null,
			},
			assetId: {
				default: null,
			},
		}
	},
	addNodeView() {
		return ReactNodeViewRenderer(NextImageWrapper)
	},
})

export default CustomImageExtension

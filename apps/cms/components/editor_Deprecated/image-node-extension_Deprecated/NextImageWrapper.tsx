import { NodeViewWrapper, NodeViewWrapperProps } from "@tiptap/react"
import Image from "next/image"
import { useState } from "react"

const NextImageWrapper = (props: NodeViewWrapperProps) => {
	const { node, selected } = props
	console.log("NextImageWrapperProps:", props)
	const [dimensions, setDimensions] = useState({ height: 100, width: 100 })
	// we can use props.updateAttributes to update any attributes so that get reflected in the editor
	return (
		<NodeViewWrapper>
			{/* <h1 className="text-3xl opacity-50">Next Image</h1> */}
			<Image
				onLoadingComplete={e => {
					console.log("onLoadingComplete", e)
					setDimensions({ height: e.height, width: e.width })
				}}
				placeholder={node.attrs.blurDataURL ? "blur" : "empty"}
				blurDataURL={node.attrs.blurDataURL ? node.attrs.blurDataURL : ""}
				// data-asset-id={node.attrs.assetId}
				className={`w-auto rounded-xl ${selected && "ring-2 ring-blue-500"}`}
				src={node.attrs.src}
				width={node.attrs.width || dimensions.width}
				height={node.attrs.height || dimensions.height}
				alt={node.attrs.alt || "Image"}
			/>

			{/* We can add any custom ui commponents here and use props.updateAttributes */}
		</NodeViewWrapper>
	)
}

export default NextImageWrapper

import { Editor } from "@tiptap/react"
import Moveable from "react-moveable"

const ImageResizer = ({ editor }: { editor: Editor }) => {
	const updateMediaSize = () => {
		const imageInfo = document.querySelector(
			".ProseMirror-selectednode"
		) as HTMLImageElement
		if (imageInfo) {
			const { selection } = editor.state
			// UPDATED: this was previously doing editor.commands.setImage({width: newWidth, height: newHeight})
			editor.commands.updateAttributes(selection.content.name, {
				src: imageInfo.src,
				width: Number(imageInfo.style.width.replace("px", "")),
				height: Number(imageInfo.style.height.replace("px", "")),
			})
			editor.commands.setNodeSelection(selection.from)
		}
	}

	return (
		<Moveable
			target={document.querySelector(".ProseMirror-selectednode") as any}
			container={null}
			origin={false}
			/* Resize event edges */
			edge={false}
			throttleDrag={0}
			/* When resize or scale, keeps a ratio of the width, height. */
			keepRatio
			/* resizable */
			/* Only one of resizable, scalable, warpable can be used. */
			resizable
			throttleResize={0}
			onResize={({
				target,
				width,
				height,
				// dist,
				delta,
			}: // direction,
			// clientX,
			// clientY,
			any) => {
				if (delta[0]) {
					target!.style.width = `${width}px`
				}
				if (delta[1]) {
					target!.style.height = `${height}px`
				}
			}}
			// { target, isDrag, clientX, clientY }: any
			onResizeEnd={() => {
				updateMediaSize()
			}}
			/* scalable */
			/* Only one of resizable, scalable, warpable can be used. */
			scalable
			throttleScale={0}
			/* Set the direction of resizable */
			renderDirections={["w", "e"]}
			onScale={({
				target,
				// scale,
				// dist,
				// delta,
				transform,
			}: // clientX,
			// clientY,
			any) => {
				target!.style.transform = transform
			}}
		/>
	)
}

export default ImageResizer

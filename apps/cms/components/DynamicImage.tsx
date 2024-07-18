/**
 * Why is this Dynamic?
 * Shows an image with dynamic sizing.
 * This is useful for showing images that are uploaded by the user.
 */
import * as NextImage from "next/image"
import { useEffect, useState } from "react"

const DynamicImage = ({ file }: { file: File }) => {
	const [dimensions, setDimensions] = useState({ height: 100, width: 100 })

	useEffect(() => {
		const img = new Image()
		img.src = URL.createObjectURL(file)
		img.onload = () => {
			setDimensions({ height: img.height, width: img.width })
		}
	}, [file])

	if (!dimensions) {
		return null
	}

	return (
		// eslint-disable-next-line react/jsx-pascal-case
		<NextImage.default
			height={dimensions.height}
			width={dimensions.width}
			src={URL.createObjectURL(file)}
			alt={file.name}
		/>
	)
}

export default DynamicImage

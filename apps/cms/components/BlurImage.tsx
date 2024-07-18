import cn from "clsx"
import Image, { ImageProps } from "next/image"
import { useState } from "react"

const BlurImage = (props: ImageProps & { className?: string }) => {
	const [isLoading, setIsLoading] = useState(true)
	const { className, ...rest } = props
	return (
		<Image
			{...rest}
			className={cn(
				"duration-700 ease-in-out bg-black",
				isLoading ? "grayscale blur-2xl" : "grayscale-0 blur-0",
				className
			)}
			onLoadingComplete={() => setIsLoading(false)}
		/>
	)
}

export default BlurImage

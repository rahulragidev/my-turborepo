"use client"

import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { cn } from "lib/utils"
import { useEffect } from "react"

const FlippingTexts = ({
	texts,
	interval = 1000,
	className,
}: {
	texts: string[]
	interval?: number
	className?: string
}) => {
	const controls = useAnimationControls()

	useEffect(() => {
		const animateTexts = async () => {
			await controls.start({ y: 0, opacity: 1 })
			await controls.start({
				y: "-100%",
				opacity: 0,
				transition: { delay: interval - 500 },
			})
		}

		animateTexts()

		const timer = setInterval(animateTexts, interval)

		return () => {
			clearInterval(timer)
		}
	}, [texts, interval, controls])

	return (
		<div className={cn("bg-slate-900 text-slate-200", className)}>
			<AnimatePresence>
				{texts.map((text, index) => (
					<motion.div
						custom={index}
						key={text}
						initial={{ y: "100%", opacity: 0 }}
						animate={controls}
						exit={{ y: "-100%", opacity: 0 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						style={{ position: "absolute" }}>
						<h1 className="text-6xl">{text}</h1>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}

export default FlippingTexts

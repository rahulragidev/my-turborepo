"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Check } from "react-feather"
import Image from "next/image"

interface IThemeOption {
	value: string
	label: string
	pillColor: string
}

const themeOptions: IThemeOption[] = [
	{ value: "light", label: "Light", pillColor: "bg-white" },
	{ value: "dark", label: "Dark", pillColor: "bg-black" },
	{ value: "sepia-theme", label: "Sepia", pillColor: "bg-yellow-700" },
]

const ThemeSelector = () => {
	const [theme, setTheme] = useState(themeOptions[0])
	const [isOpen, setIsOpen] = useState(false)

	const bubbleSize = 50

	const wrapperRef = useRef<HTMLDivElement | null>(null)

	const handleThemeChange = (value: React.SetStateAction<string>) => {
		setTheme(themeOptions.filter(option => option.value === value)[0])
		setIsOpen(false)
		// Your custom logic to handle the theme change
	}

	useEffect(() => {
		document.body.className = theme.value
	}, [theme])

	return (
		<div ref={wrapperRef} className="fixed bottom-6 right-[12vw] bg-pink-300">
			<div className="relative">
				{themeOptions
					.filter(option => option.value !== theme.value)
					.map((option, index) => (
						<motion.button
							key={option.value}
							aria-label={option.label}
							onClick={() => handleThemeChange(option.value)}
							type="button"
							style={{
								height: bubbleSize,
								width: bubbleSize,
							}}
							initial={{
								right: -50,
							}}
							animate={{
								right: isOpen
									? index * (bubbleSize + 4) + 4
									: -bubbleSize,
							}}
							className={`absolute bottom-0 h-14 w-14 rounded-full
                            ${option.pillColor} border-8 border-white/50 flex items-center justify-center focus:outline-none`}
						/>
					))}
				<motion.button
					onClick={() => setIsOpen(!isOpen)}
					style={{
						height: bubbleSize,
						width: bubbleSize,
					}}
					type="button"
					aria-label="Toggle theme selector"
					className={`absolute bottom-0 rounded-full z-40 shadow-lg
                    ${theme.pillColor} border-8 flex items-center justify-center focus:outline-none`}>
					<Image
						className="text-[var(--text-color-base)]"
						src={"/PalletteLineIcon.svg"}
						height={16}
						width={16}
						alt="Pallette Icon"
					/>
				</motion.button>
			</div>
		</div>
	)
}

export default ThemeSelector

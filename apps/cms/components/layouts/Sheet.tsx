"use client"

import * as RadixDialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

// Trigger
const Sheet = RadixDialog.Root
const SheetTrigger = RadixDialog.Trigger
const SheetClose = RadixDialog.Close
const SheetTitle = RadixDialog.Title

const MotionRadixDialogContent = motion(RadixDialog.Content)

const SheetContent = ({
	children,
	side = "right",
	className,
}: {
	children: ReactNode | ReactNode[]
	side?: "left" | "right" | "top" | "bottom"
	className?: string
}) => {
	const position = () => {
		switch (side) {
			case "left":
				return "left-0 top-0"
			case "right":
				return "right-0 top-0"
			case "top":
				return "top-0 left-0 right-0"
			case "bottom":
				return "bottom-0 left-0 right-0"
			default:
				return "right-0 top-0"
		}
	}

	const initialXYValues = () => {
		switch (side) {
			case "left":
				return { x: -100, y: 0 }
			case "right":
				return { x: 100, y: 0 }
			case "top":
				return { x: 0, y: -100 }
			case "bottom":
				return { x: 0, y: 100 }
			default:
				return { x: 100, y: 0 }
		}
	}

	return (
		<RadixDialog.Portal>
			<RadixDialog.Overlay className="fixed inset-0 w-screen h-screen bg-slate-950/30 backdrop-blur-sm" />
			<MotionRadixDialogContent
				initial={{ x: initialXYValues().x, y: initialXYValues().y }}
				animate={{ x: 0, y: 0 }}
				exit={{ x: initialXYValues().x, y: initialXYValues().y }}
				transition={{
					type: "easeInOut",
				}}
				className={twMerge(
					clsx(
						"fixed bg-slate-950 overflow-y-scroll shadow-2xl z-[9999]",
						"h-screen md:w-[33vw] min-w-[600px] max-md:w-full",
						position(),
						className
					)
				)}>
				{children}
			</MotionRadixDialogContent>
		</RadixDialog.Portal>
	)
}

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger }

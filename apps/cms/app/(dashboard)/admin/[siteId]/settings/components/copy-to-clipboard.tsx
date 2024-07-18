"use client"

import { Slot } from "@radix-ui/react-slot"
import React from "react"
import { Copy } from "react-feather"
import toast from "react-hot-toast"

interface Props {
	value: string
	asChild?: boolean
	children?: React.ReactNode
}

const CopyToClipboard = ({ value, asChild, children }: Props) => {
	const Button = asChild ? Slot : "button"

	const onCopy = async () => {
		await navigator.clipboard.writeText(value)
		toast.success("Copied to clipboard")
	}

	return (
		<Button
			className="flex items-center py-1 px-2 space-x-2 rounded-md cursor-pointer bg-slate-800"
			onClick={onCopy}>
			{children}
			<Copy height={16} />
		</Button>
	)
}

export default CopyToClipboard

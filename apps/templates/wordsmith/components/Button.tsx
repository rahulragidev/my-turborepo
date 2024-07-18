import { cn } from "@/libs/cn"
import { Slot } from "@radix-ui/react-slot"
import React from "react"

interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
	asChild?: boolean
	children: React.ReactNode
}

const Button = ({
	children,
	onClick,
	asChild = false,
	className,
	...props
}: ButtonProps) => {
	const Component = asChild ? Slot : "button"

	return (
		<Component
			{...props}
			type={props.type ?? "button"}
			onClick={onClick}
			className={cn(
				"flex flex-row items-center space-x-2 bg-secondary px-6 py-3 rounded-full cursor-pointer font-semibold xl:text-sm text-primary",
				"transition ease-in-out duration-300 hover:-translate-y-1 hover:scale-105",
				"hover:bg-primary hover:text-white",
				className
			)}>
			{children}
		</Component>
	)
}

export default Button

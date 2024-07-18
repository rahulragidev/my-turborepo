import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { useCallback } from "react"
// import Button from "../atoms/Button"
import { ChevronDown } from "react-feather"

interface CustomDropdownMenuProps {
	buttonProps: {
		variant: "primary" | "secondary" | "tertiary" | "slate"
		rounded: boolean
		disabled?: boolean
		className?: string
	}
	items: {
		key: string
		children: JSX.Element[] | JSX.Element | string
		props: DropdownMenu.DropdownMenuItemProps
	}[]
	label?: string
	labelClasses?: string
	contentContainerProps?: DropdownMenu.DropdownMenuContentProps
	rootProps?: DropdownMenu.DropdownMenuProps
	otherProps?: JSX.IntrinsicAttributes
}

const CustomDropdownMenu = (props: CustomDropdownMenuProps) => {
	const {
		rootProps,
		label,
		labelClasses = "font-semibold text-sm truncate capitalize",
		items,
		contentContainerProps,
		buttonProps,
		otherProps,
	} = props

	const styles = useCallback(() => {
		switch (buttonProps.variant) {
			case "primary":
				return "bg-purple-400 hover:bg-purple-700 text-white"
			case "secondary":
				return "bg-transparent hover:bg-purple-200 text-purple-400 border-2 border-solid border-purple-300"
			case "tertiary":
				return "bg-transparent hover:bg-purple-200 text-purple-400"
			case "slate":
				return "bg-slate-200 hover:bg-slate-400 text-slate-800"
			default:
				return "bg-purple-400 hover:bg-purple-700 text-white [data-state='open']:bg-purple-600"
		}
	}, [buttonProps.variant])()

	const buttonClasses = clsx(
		styles,
		"flex items-center py-2 px-2 space-x-1 font-semibold",
		buttonProps.rounded ? "rounded-full" : "rounded-sm",
		buttonProps.disabled
			? "!bg-slate-300 !text-slate-600 opacity-50 cursor-not-allowed pointer-none hover:bg-transparent"
			: "",
		buttonProps.className
	)

	return (
		<DropdownMenu.Root {...rootProps} {...otherProps}>
			{/* Trigger is ths button */}
			<DropdownMenu.Trigger className={buttonClasses}>
				<p className={labelClasses}>{label}</p>
				<ChevronDown size={16} />
			</DropdownMenu.Trigger>

			{/* Portal is the menu */}
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					{...contentContainerProps}
					className="bg-white shadow-lg rounded-md min-w-[10rem] space-y-2">
					<DropdownMenu.Group>
						{items.map(item => (
							<DropdownMenu.Item
								key={item.key}
								{...item.props}
								className={clsx(
									"font-secondary tracking-wide text-slate-800 cursor-pointer hover:bg-purple-100 hover:outline-none px-4 py-2 overflow-hidden",
									// @ts-ignore
									item.props.isActive && "bg-purple-200"
								)}>
								{/* @ts-ignore */}
								{item.children}
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Group>
					<DropdownMenu.CheckboxItem>
						<DropdownMenu.ItemIndicator />
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger />
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent />
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
					<DropdownMenu.Separator />
					{/* <DropdownMenu.Arrow fill="white" color="white" className="bg-white" /> */}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

export default CustomDropdownMenu

CustomDropdownMenu.defaultProps = {
	// eslint-disable-next-line react/default-props-match-prop-types
	buttonProps: {
		variant: "primary",
	},
}

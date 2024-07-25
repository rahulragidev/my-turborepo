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
                "flex items-center space-x-2 bg-foreground text-white px-4 py-2 rounded-full cursor-pointer font-semibold xl:text-sm text-xl hover:shadow-md transition-all ease-in-out",
                "text-background",
                className
            )}>
            {children}
        </Component>
    )
}

export default Button

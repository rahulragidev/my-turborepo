import { Slot } from "@radix-ui/react-slot"
import { cn } from "@repo/utils/cn"
import Link, { type LinkProps } from "next/link"
import { forwardRef } from "react"
import { Loader } from "react-feather"

const variantStyles = {
    primary:
        "bg-slate-100 hover:bg-slate-200 text-slate-950 data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed",
    secondary:
        "bg-transparent border border-slate-400 text-slate-300 hover:bg-slate-100 hover:text-slate-950 data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed",
    tertiary:
        "border-none bg-transparent hover:bg-slate-800 data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed",
    danger: "bg-red-500 hover:bg-red-600 text-white data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed"
}

interface CommonProps {
    rounded?: boolean
    loading?: boolean
    variant?: keyof typeof variantStyles
    disabled?: boolean
}

type ButtonLinkProps = LinkProps &
    CommonProps &
    Omit<React.ComponentPropsWithoutRef<"a">, "href">

export type ButtonProps = CommonProps &
    React.ComponentPropsWithoutRef<"button"> & {
        asChild?: boolean
    }

// Tagged union type with href
export type Props = ButtonProps | ButtonLinkProps

const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, Props>(
    function Button(
        { loading = false, rounded = false, variant = "primary", ...props },
        ref
    ) {
        const disabled = props.disabled || loading
        const defaultStyles = cn(
            "px-4 py-2 flex items-center space-x-1 max-w-fit font-medium",
            rounded ? "rounded-full" : "rounded-md",
            variantStyles[variant],
            props.className
        )

        if ("href" in props) {
            return (
                <Link
                    ref={ref}
                    {...props}
                    className={defaultStyles}
                    data-disabled={disabled}>
                    {loading && <Loader className="animate-spin" height={14} />}
                    {props.children}
                </Link>
            )
        }

        const Btn = props.asChild ? Slot : "button"

        return (
            <Btn
                {...props}
                ref={ref}
                className={defaultStyles}
                data-disabled={disabled}
                disabled={disabled}>
                {props.asChild ? (
                    props.children
                ) : (
                    <>
                        {loading && (
                            <Loader className="animate-spin" height={14} />
                        )}
                        {props.children}
                    </>
                )}
            </Btn>
        )
    }
)

export default Button

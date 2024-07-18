"use client"

import Button, { ButtonProps } from "components/Button"
import { useFormStatus } from "react-dom"

interface Props extends ButtonProps {}

const ButtonWithFeedback = ({ children, ...props }: Props) => {
	const { pending } = useFormStatus()

	return (
		<Button {...props} loading={props.loading || pending}>
			{children}
		</Button>
	)
}

export default ButtonWithFeedback

"use client"

import { ReactNode } from "react"
import * as AlertDialog from "../primitives/alert-dialog"

const CustomAlertDialog = (
	props: AlertDialog.AlertDialogProps & { triggerButton: ReactNode }
) => {
	const { triggerButton, children, ...otherProps } = props

	return (
		<AlertDialog.Root {...otherProps}>
			<AlertDialog.Trigger asChild>{triggerButton}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 bg-black/25 backdrop-blur" />
				<AlertDialog.Content className="fixed top-1/2 left-1/2 px-6 pt-8 pb-3 rounded-2xl border-2 border-solid shadow-xl -translate-x-1/2 -translate-y-1/2 focus:outline-none bg-slate-950/75 backdrop-blur-lg border-slate-800/40 w-[90vw] max-w-[30rem]">
					{children}
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}

export default CustomAlertDialog

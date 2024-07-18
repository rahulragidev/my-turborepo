import * as RadixDialog from "@radix-ui/react-dialog"
import { motion } from "framer-motion"
import { cn } from "lib/utils"

const CustomDialogBox = (props: RadixDialog.DialogProps & { className?: string }) => {
	const { children, className } = props

	const MotionContent = motion(RadixDialog.Content)
	const modalClassName = cn(
		"bg-slate-950/90 backdrop-blur border-2 border-solid border-slate-700/40 rounded-2xl  shadow-xl  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[90vw] max-w-[30rem] focus:outline-none max-h-[40vh] overflow-y-scroll",
		className
	)
	return (
		<RadixDialog.Root {...props}>
			<RadixDialog.Portal>
				<RadixDialog.Overlay className="fixed inset-0 bg-black opacity-60 w-screen h-screen backdrop-filter-blur" />
				<MotionContent className={modalClassName}>{children}</MotionContent>
			</RadixDialog.Portal>
		</RadixDialog.Root>
	)
}

export default CustomDialogBox

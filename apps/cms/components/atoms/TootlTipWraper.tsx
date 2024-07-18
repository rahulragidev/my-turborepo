import * as RadixToolTip from "@radix-ui/react-tooltip"
import { ReactNode } from "react"

const ToolTipWrapper = ({
	children,
	toolTipContent,
}: {
	children: ReactNode
	toolTipContent: ReactNode | string
}) => (
	<RadixToolTip.Provider>
		<RadixToolTip.Root delayDuration={100}>
			<RadixToolTip.Trigger>{children}</RadixToolTip.Trigger>
			<RadixToolTip.Portal>
				<RadixToolTip.Content className="bg-black dark:text-slate-100 text-slate-900 font-secondary px-3 py-2 z-[999] rounded-lg shadow-sm">
					<RadixToolTip.Arrow />
					{toolTipContent}
				</RadixToolTip.Content>
			</RadixToolTip.Portal>
		</RadixToolTip.Root>
	</RadixToolTip.Provider>
)

export default ToolTipWrapper

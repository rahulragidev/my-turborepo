/* eslint-disable jsx-a11y/control-has-associated-label */
import { Editor } from "@tiptap/core"
import Button from "components/Button"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import useAllPagesBySite from "dataHooks/useAllPagesBySite"
import { cn, getUrlFromString } from "lib/utils"
import { Check, ExternalLink, Trash } from "lucide-react"
import { useParams } from "next/navigation"
import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

interface LinkSelectorProps {
	editor: Editor
}

const AllPagesList = ({
	editor,
	setIsOpen,
}: {
	editor: Editor
	setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { siteId } = useParams<{ siteId: string }>() ?? { siteId: undefined }

	const { data, error } = useAllPagesBySite(siteId as string)

	const handlePageSelection = useCallback(
		(slug: string) => {
			debugger
			if (editor) {
				const fullSlug = `${siteId}/${slug}`
				editor
					.chain()
					.focus()
					.setLink({ href: slug, target: "" })
					.focus("end")
					.run()
				setIsOpen(false)
			}
		},
		[siteId]
	)

	if (error) {
		return <div>Error</div>
	}

	if (data) {
		console.log("allpages data:", data)
		return (
			<ul className="w-full">
				{data?.data?.data
					?.filter(page => page.name !== "root")
					.map(page => (
						<li key={page.id}>
							<button
								type="button"
								onClick={() => handlePageSelection(page.slug)}
								className="w-full px-4 py-2 hover:bg-slate-800/50">
								<div className="text-left">
									<p className="text-base font-semibold">{page.name}</p>
									<span className="block font-mono text-sm">
										/{page.slug}
									</span>
								</div>
							</button>
						</li>
					))}
			</ul>
		)
	}

	return <div>Loading...</div>
}

const LinkSelector: FC<LinkSelectorProps> = ({ editor }) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [dialogOpen, setDialogOpen] = useState(false)

	// Autofocus on input by default
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current?.focus()
		}
	})

	return (
		<>
			{/* Trigger Button */}
			<div className="relative">
				<button
					type="button"
					className="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800 active:bg-slate-200"
					onClick={() => {
						setDialogOpen(true)
					}}>
					<p
						className={cn(
							"underline decoration-slate-400 underline-offset-4",
							{
								"text-blue-500": editor.isActive("link"),
							}
						)}>
						Link
					</p>
				</button>
			</div>
			{/* Dialog Box */}
			<CustomDialogBox
				open={dialogOpen}
				onOpenChange={open => setDialogOpen(open)}
				className="">
				<div className="px-4 py-4">
					<div className="flex items-center space-x-1">
						<h3 className="font-semibold text-lg">Add External Link</h3>
						<ExternalLink height={14} />
					</div>
					<p>Link to an external website</p>
				</div>
				<div className="px-4 py-4">
					<form
						className="w-full flex items-stretch overflow-hidden rounded-md"
						onSubmit={e => {
							e.preventDefault()
							const input = e.currentTarget[0] as HTMLInputElement
							const url = getUrlFromString(input.value)
							if (url) {
								editor
									.chain()
									.focus()
									.setLink({ href: url, target: "_blank" })
									.run()
								setDialogOpen(false)
							}
						}}>
						<input
							ref={inputRef}
							type="text"
							placeholder="Ex: www.google.com"
							className="flex-1 bg-slate-950 outline-none w-full py-2 px-2"
							defaultValue={editor.getAttributes("link").href || ""}
						/>
						{editor.getAttributes("link").href ? (
							<Button
								variant="danger"
								type="submit"
								onClick={() => {
									editor.chain().focus().unsetLink().run()
									setDialogOpen(false)
								}}>
								<Trash className="h-4 w-4" />
							</Button>
						) : (
							<Button
								type="submit"
								className="flex items-center rounded-sm p-1 text-slate-600 transition-all hover:bg-slate-100">
								<Check className="h-4 w-4" />
							</Button>
						)}
					</form>
				</div>
				<div className="px-4 py-4 border-t border-solid border-slate-600/50">
					<h3 className="font-semibold text-lg">Add Internal Link</h3>
					<p>Link to a page on your site</p>
				</div>
				<AllPagesList editor={editor} setIsOpen={setDialogOpen} />
			</CustomDialogBox>
		</>
	)
}

export default LinkSelector

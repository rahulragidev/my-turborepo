import { ChevronLeftCircle } from "lucide-react"
import Link from "next/link"

export const SkeletonCard = () => (
	<div className="relative px-4 pt-4 pb-6 my-2 text-left rounded-2xl bg-slate-800">
		<div className="overflow-hidden relative w-full h-40 rounded bg-slate-700" />
		<div className="flex justify-between items-center pt-12">
			<div className="space-y-2">
				<div className="w-40 h-6 rounded bg-slate-600" />
				<div className="w-20 h-4 rounded bg-slate-600" />
			</div>
		</div>
	</div>
)

const TemplatesLoading = () => {
	return (
		<div className="flex flex-col px-8">
			<Link
				href="/create"
				className="flex items-center py-2 -ml-1 space-x-1 rounded transition-all cursor-pointer w-fit hover:bg-slate-900">
				<ChevronLeftCircle height={16} /> <span>Go Back</span>
			</Link>
			<div className="mb-12">
				<h2 className="text-4xl font-bold">Choose a template</h2>
				<p>
					Templates are pre-built websites. Your audience will see this when
					they visit your site.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-12 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</div>
		</div>
	)
}

export default TemplatesLoading

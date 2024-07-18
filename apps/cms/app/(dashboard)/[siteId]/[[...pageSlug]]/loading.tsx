const Loading = () => (
	<main className="md:ml-[20rem]">
		<div className="py-6 px-4 w-full mx-auto max-w-5xl md:px-10 min-h-[62vh]">
			<div className="flex justify-between items-stretch ">
				<div className="flex items-center space-x-2 w-12">
					<div className="w-full h-8 rounded-md animate-pulse bg-slate-800" />
				</div>
				<div className="w-1/4 space-x-2 flex items-center">
					<div className="w-1/2 h-8 rounded-md animate-pulse bg-slate-800" />
					<div className="w-1/2 h-8 rounded-md animate-pulse bg-slate-800" />
					<div className="w-12 h-8 rounded-md animate-pulse bg-slate-800" />
				</div>
			</div>
			<div className="flex flex-col space-y-2 py-16">
				<div className="w-full h-8 rounded-md animate-pulse bg-slate-800" />
				<div className="w-full h-8 rounded-md animate-pulse bg-slate-800" />
				<div className="w-1/2 h-8 rounded-md animate-pulse bg-slate-800" />
			</div>
		</div>
	</main>
)

export default Loading

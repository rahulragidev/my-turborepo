const LoadingShimmer = ({ height = "2rem", width = "100%", rounded = false }) => {
	return (
		<div
			className={`inset-0 bg-slate-400 bg-opacity-30 backdrop-filter-blur brightness-75 rounded-${
				rounded ? "full" : "md"
			} animate-pulse h-[${height}] w-[${width}] relative overflow-hidden`}
		/>
	)
}

export default LoadingShimmer

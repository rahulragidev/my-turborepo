import LoadingShimmer from "components/LoadingShimmer"

const Loading = () => {
	return (
		<div className="mx-auto max-w-5xl space-y-4">
			<LoadingShimmer height="120" width="100%" />
			<LoadingShimmer height="120" width="100%" />
			<LoadingShimmer height="120" width="100%" />
			<LoadingShimmer height="120" width="100%" />
			<LoadingShimmer height="120" width="100%" />
		</div>
	)
}

export default Loading

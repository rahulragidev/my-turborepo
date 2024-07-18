import LoadingShimmer from "components/LoadingShimmer"

const SiteNamePageLoading = () => {
	return (
		<div className="flex flex-col gap-4">
			<LoadingShimmer height="14" width="200" />
			<LoadingShimmer height="14" width="100" />
			<LoadingShimmer height="14" width="100%" />
		</div>
	)
}

export default SiteNamePageLoading

import { SiteCardSkeleton } from "components/SiteCard"

const SitesLoading = async () => {
	return (
		<main className="py-4 px-8 mx-auto max-w-5xl h-screen">
			<div>
				<h2 className="mb-4 text-3xl font-semibold">My Sites</h2>
			</div>

			<div className="grid grid-cols-1 gap-8 py-16 md:grid-cols-2 lg:grid-cols-3">
				<SiteCardSkeleton />
				<SiteCardSkeleton />
				<SiteCardSkeleton />
			</div>
		</main>
	)
}

export default SitesLoading

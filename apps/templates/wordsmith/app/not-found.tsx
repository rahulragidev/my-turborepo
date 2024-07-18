import Link from "next/link"

export default function NotFoundPage() {
	return (
		<main className="grid place-items-center py-24 px-6 min-h-full sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="text-base font-semibold">404</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
					Page not found
				</h1>
				<p className="mt-6 text-base leading-7 text-gray-600">
					Sorry, we couldn’t find the page you’re looking for.
				</p>
				<div className="flex gap-x-6 justify-center items-center mt-10">
					<Link
						href="/"
						className="py-2.5 px-3.5 text-sm font-semibold text-white bg-black rounded-md shadow-sm dark:text-black dark:bg-white hover:opacity-75 focus-visible:outline-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
						Go back home
					</Link>
				</div>
			</div>
		</main>
	)
}

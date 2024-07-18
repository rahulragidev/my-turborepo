import Button from "@/components/Button"
import Link from "next/link"

export default function NotFoundPage() {
	return (
		<main className="grid place-items-center py-24 px-6 min-h-full sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="text-base font-semibold">404</p>
				<h1 className="mt-4">
					Page not found
				</h1>
				<p className="mt-6 text-base leading-7">
					Sorry, we couldn’t find the page you’re looking for.
				</p>
				<div className='flex justify-center items-center'>
					<Button className="mt-10" asChild>
						<Link
							href="/"
							>
							Go back home
						</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}

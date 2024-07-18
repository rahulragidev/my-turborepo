"use client"

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<div className="flex flex-col justify-center items-center p-8 w-screen">
			<h2>Something went wrong!</h2>
			<p>{error.digest}</p>
			<button
				className="py-2 px-4 text-white bg-black rounded dark:text-black dark:bg-white"
				onClick={() => reset()}>
				Try again
			</button>
		</div>
	)
}

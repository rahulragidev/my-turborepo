"use client"

import Button from "@/components/Button"

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<div className="flex flex-col gap-4 justify-center items-center">
			<h2>Something went wrong!</h2>
			<pre>
				{error.message}
			</pre>
			<Button
				onClick={() => reset()}>
				Try again
			</Button>
		</div>
	)
}

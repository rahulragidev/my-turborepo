"use client"

// Error components must be Client Components

import Button from "components/Button"
import { useEffect } from "react"

const Error = ({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) => {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center text-center">
			<h2>Something went wrong!</h2>
			<p>{error.digest}</p>
			<Button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}>
				Try again
			</Button>
		</div>
	)
}
export default Error

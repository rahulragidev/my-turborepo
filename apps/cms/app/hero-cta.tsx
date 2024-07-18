"use client"

import { useAuth } from "@clerk/nextjs"
import Button from "components/Button"
import useUserData from "dataHooks/useUser"
import { ArrowRight } from "lucide-react"

const HeroCta = () => {
	const { isSignedIn } = useAuth()
	const { data: userData } = useUserData()
	const siteCount = userData?.data?.data?.sites?.length ?? 0

	if (isSignedIn) {
		if (siteCount > 1) {
			return (
				<Button href="/sites" className="text-xl px-8 py-3 rounded-full">
					<span>Go to my Sites</span>
					<ArrowRight />
				</Button>
			)
		}
		return (
			<Button href="/create" className="text-xl px-8 py-3 rounded-full">
				<span>Create a new site</span>
				<ArrowRight />
			</Button>
		)
	}

	return (
		<Button href="/create" className="text-xl px-8 py-3 rounded-full">
			<span>Create a new site</span>
			<ArrowRight />
		</Button>
	)
}

export default HeroCta

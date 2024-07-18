"use client"

import { UserButton, useAuth } from "@clerk/nextjs"
import Button from "components/Button"
import Chip from "components/atoms/Chip"
import LogoFull from "components/atoms/LogoFull"
import useUserData from "dataHooks/useUser"
import createBillingPortal from "libs/stripe/createBillingPortal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Header = () => {
	const { isSignedIn } = useAuth()
	const { data: userData } = useUserData()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	// const billingUrl = useRef<string | null>(null)
	// Clerk: Missing props.
	// <UserProfile.Page /> component requires the following props: url, label, labelIcon, alongside with children to be rendered inside the page.

	return (
		<header className="flex justify-between items-center py-8 px-4 mx-auto max-w-6xl md:px-8 xl:px-0">
			<Link href="/" className="flex items-center space-x-1">
				<LogoFull width={60} />
				<Chip>Beta</Chip>
			</Link>
			<div className="flex items-center space-x-2">
				{isSignedIn ? (
					<>
						{userData?.data?.data?.subscription?.customer && (
							<Button
								variant="secondary"
								loading={isLoading}
								onClick={async () => {
									setIsLoading(true)
									const url = await createBillingPortal({
										customerId: userData?.data?.data?.subscription
											?.customer as string,
									})

									if (url) {
										router.push(url)
									}
									setIsLoading(false)
								}}>
								Manage Billing
							</Button>
						)}
						<UserButton afterSignOutUrl="/" />
					</>
				) : (
					<>
						<Button href="/sign-in" variant="secondary">
							Sign In
						</Button>
						<Button href="/sign-up">Register</Button>
					</>
				)}
			</div>
		</header>
	)
}

export default Header

"use client"

import { useUser } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import { asyncDebounce, cn } from "lib/utils"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import slugify from "libs/slugify"
import { ArrowRight, CheckCircle2, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { Info } from "react-feather"
import { ResponseSchema } from "types/generated/types"
import { useDebounceValue } from "usehooks-ts"
import CreateSiteButton from "./create-site-button"

const SITE_NAME_AVAILABLE = gql`
	query CheckSiteNameAvailability($nameOrSlug: String!) {
		data: checkSiteNameAvailability(nameOrSlug: $nameOrSlug) {
			message
			success
		}
	}
`

const getNextStepLink = (siteName: string) =>
	`/create/templates?siteName=${encodeURIComponent(siteName)}`

function isValidSiteName(siteName: string) {
	const name = siteName.trim()
	return name.length > 0 && name.length <= 50
}

type Availablity = Partial<ResponseSchema> & { isValiding: boolean }

function useNameAvailablity(siteName: string) {
	const [nameAvailable, setNameAvailable] = useState<Availablity>({
		isValiding: false,
		success: null,
		message: "",
	})

	const debouncedCheck = useCallback(
		(name: string, signal?: AbortSignal) =>
			asyncDebounce(async function check(name: string) {
				if (!isValidSiteName(name)) {
					setNameAvailable({
						success: false,
						message: "",
						isValiding: false,
					})

					return false
				}

				try {
					setNameAvailable({
						isValiding: true,
					})

					const response = await fetchWithToken<
						GraphQLResponse<ResponseSchema>
					>({
						query: SITE_NAME_AVAILABLE,
						variables: { nameOrSlug: name },
						signal,
					})

					setNameAvailable({
						...response.data,
						isValiding: false,
					})
				} catch (e) {
					if (e instanceof DOMException && e.name === "AbortError") {
						setNameAvailable({
							success: null,
							message: "",
							isValiding: false,
						})
						return null
					}

					setNameAvailable({
						success: false,
						message: (e as Error).message || "Something went wrong",
						isValiding: false,
					})
				}

				return null
			}, 1250)(name),
		[]
	)

	useEffect(() => {
		const controller = new AbortController()

		if (isValidSiteName(siteName)) {
			debouncedCheck(siteName, controller.signal)
		} else {
			// reset state if siteName is not valid
			setNameAvailable({
				success: null,
				message: "",
				isValiding: false,
			})
		}

		// everytime siteName changes, make a debounced call to fetchWithToken(SITE_NAME_AVAILABLE,
		// and set the response to nameAvailable state)
		return () => controller.abort()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteName])

	return nameAvailable
}

const CTA = ({ siteName, templateId }: { siteName: string; templateId?: string }) => {
	// we expect templateId to be valid if defined
	if (templateId) {
		return <CreateSiteButton siteName={siteName} templateId={templateId} />
	}

	return (
		<Link
			tabIndex={0}
			href={getNextStepLink(siteName)}
			className="flex items-center py-2 px-4 space-x-2 text-xl text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full min-w-fit">
			<span>Select Template</span>
			<ArrowRight height={18} />
		</Link>
	)
}

interface Props {
	templateId?: string
}

const NameCheck = ({ templateId }: Props) => {
	const router = useRouter()
	const [siteName, setSiteName] = useState("")
	const { user, isSignedIn } = useUser()
	const [hasAttemptedSubmission, setAttemptSubmission] = useState(false)
	const nameAvailable = useNameAvailablity(siteName)
	const [debouncedSiteName] = useDebounceValue(siteName, 500)

	const [isPending, startTransition] = useTransition()

	const submit = useCallback(() => {
		console.debug("submitting")
		setAttemptSubmission(false)
		startTransition(() => {
			router.push(getNextStepLink(siteName))
		})
	}, [router, siteName])

	const onKeyDown = useCallback(
		function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
			console.log(e.key, nameAvailable)
			if (e.key !== "Enter" || !nameAvailable.success) return

			// submit when finish the loading and the name is available
			if (nameAvailable.isValiding) {
				setAttemptSubmission(true)
				return
			}

			submit()
		},
		[submit, nameAvailable]
	)

	useEffect(() => {
		if (!hasAttemptedSubmission || nameAvailable.isValiding) {
			return
		}

		if (nameAvailable.success) {
			setAttemptSubmission(false)
		}

		submit()
	}, [nameAvailable, submit, hasAttemptedSubmission])

	useEffect(() => {
		if (debouncedSiteName) {
			setSiteName(slugify(debouncedSiteName))
		}
	}, [debouncedSiteName])

	const renderAdornment = () => {
		switch (true) {
			case nameAvailable.isValiding:
				return <Loader className="animate-spin" />
			case nameAvailable.success:
				return <CheckCircle2 className="text-green-500" />
			case nameAvailable.success === false:
				return <Info color="red" />
			default:
				return null
		}
	}

	const textStyles = "text-xl md:text-2xl lg:text-4xl font-medium tracking-tight"

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (inputRef?.current) {
			inputRef.current.focus()
		}
	}, [inputRef])

	const placeholder = isSignedIn
		? `${user?.firstName?.toLowerCase()}-${user?.lastName?.toLowerCase()}`
		: `your-name`
	return (
		<div className="relative flex items-stretch justify-center border border-solid border-slate-500/25 rounded-full overflow-hidden w-fit p-4 focus-within:ring-2 focus-within:ring-slate-100 mx-auto">
			{/* <AutoWidthInput
				tabIndex={0}
				className={cn(
					"bg-transparent placeholder:text-slate-500/75 pl-4 truncate focus:ring-0 focus:outline-none w-fit text-center",
					textStyles
				)}
				type="text"
				disabled={isPending}
				placeholder={placeholder}
				value={siteName}
				maxLength={50}
				onChange={e => {
					setSiteName((e.target as HTMLInputElement).value)
					if (!hasAttemptedSubmission) return
					setAttemptSubmission(false)
				}}
			/> */}
			<input
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus
				ref={inputRef}
				tabIndex={0}
				className={cn(
					"bg-transparent placeholder:text-slate-500/75 pl-4 truncate focus:ring-0 focus:outline-none w-fit text-center",
					textStyles
				)}
				type="text"
				disabled={isPending}
				placeholder={placeholder}
				value={siteName}
				maxLength={50}
				onKeyDown={onKeyDown}
				onChange={e => {
					setSiteName(e.target.value)
					if (!hasAttemptedSubmission) return
					setAttemptSubmission(false)
				}}
			/>
			<p className={cn(textStyles, "px-6 py-4 flex-1 text-left opacity-50")}>
				.lokus.website
			</p>
			{!nameAvailable.isValiding && nameAvailable.success && !isPending && (
				<CTA siteName={siteName} templateId={templateId} />
			)}
			{!nameAvailable.success && (
				<div className="flex items-center py-4 px-4 space-x-2 mx-auto">
					{renderAdornment()}
					<p
						className={cn(
							"font-medium tracking-tight capitalize",
							nameAvailable?.success && "text-green-500"
						)}>
						{nameAvailable.message}
					</p>
				</div>
			)}
		</div>
	)
}

export default NameCheck

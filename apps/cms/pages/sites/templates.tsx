import { useAuth } from "@clerk/nextjs"
import { buildClerkProps, getAuth } from "@clerk/nextjs/server"
import Button from "components/Button"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import getSymbolFromCurrency from "currency-symbol-map"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { ExternalLink } from "lucide-react"
import { GetServerSideProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback, useRef, useState } from "react"
import Confetti from "react-confetti"
import { ArrowRight, Check } from "react-feather"
import toast from "react-hot-toast"
import { CreateSiteResponse, Template, TemplatesResponse } from "types/generated/types"
import { useWindowSize } from "usehooks-ts"

const CREATE_SITE_MUTATION = gql`
	mutation CreateSite($data: SiteInput!) {
		data: createSite(data: $data) {
			siteCreated
			vercelProjectCreated
			pageCreated
			frameWorkSet
			envsAdded
			subdomainAdded
			siteUpdatedWithVercelProjectId
			message
			data {
				id
				name
			}
		}
	}
`

const ChooseTemplate = ({ templates }: { templates: Template[] }) => {
	const router = useRouter()
	const { siteName } = router.query
	// const stripe = getStripe()
	const { getToken } = useAuth()

	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
	const [creationState, setCreationState] = useState<
		"creating" | "created" | "error" | null
	>(null)

	const newSiteId = useRef("")

	const createSite = useCallback(async (): Promise<CreateSiteResponse> => {
		try {
			setCreationState("creating")
			const res = await fetchWithToken<GraphQLResponse<CreateSiteResponse>>({
				query: CREATE_SITE_MUTATION,
				variables: {
					data: {
						name: siteName,
						templateId: selectedTemplate,
					},
				},
				getToken,
			})

			if (res.data?.siteCreated) {
				setCreationState("created")
				newSiteId.current = res.data.data?.id as string
			} else {
				setCreationState("error")
				console.error(res.data?.message)
				toast.error(
					res.data?.message ?? "Something went wrong while creating your site"
				)
			}

			return res.data!
		} catch (error: any) {
			console.debug("error", error)
			setCreationState("error")
			return error
		}
	}, [siteName, selectedTemplate, getToken])

	// Confetti stuff
	const { width, height } = useWindowSize()

	return (
		<>
			<div className="py-4 px-4 md:py-12 md:px-12 lg:py-32 lg:px-24">
				<h1 className="mb-12 text-5xl">
					<span className="text-3xl capitalize text-slate-500">
						Choose a Template for
					</span>{" "}
					<br />
					{router.query.siteName}
				</h1>
				<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
					{templates?.map((template: Template) => (
						<TemplateCard
							currentTemplate={selectedTemplate}
							onTemplateSelect={(id: string) => setSelectedTemplate(id)}
							key={template.id}
							template={template}
						/>
					))}
				</div>
			</div>
			{selectedTemplate && (
				<Button
					disabled={creationState === "creating" || creationState === "created"}
					className="fixed right-0 left-0 bottom-8 justify-center mx-auto text-xl text-center max-w-fit"
					loading={creationState === "creating"}
					onClick={() => createSite()}>
					{(!creationState || creationState === "error") && <p>Create Site</p>}
					{creationState === "creating" && <p>Creating...</p>}
					{creationState === "created" && (
						<>
							<Check height={12} />
							<p>Created</p>
						</>
					)}
				</Button>
			)}
			<Confetti width={width} height={height} run={creationState === "created"} />
			{/* Modal */}
			<CustomDialogBox open={creationState === "created"}>
				<div className="p-6 space-y-4">
					<h1 className="text-4xl font-medium tracking-tight text-slate-200">
						<span>🎉</span>
						<br />
						Site Created!
					</h1>
					<p className="text-xl text-slate-400">
						Your site has been created! You can now go to the dashboard and
						manage your site.
					</p>
					<Button
						variant="primary"
						className="space-x-2"
						onClick={() => {
							console.log(newSiteId.current)
							if (newSiteId.current) router.push(`/${newSiteId.current}`)
						}}>
						<span>Go to Site</span>
						<ArrowRight height={16} />
					</Button>
				</div>
			</CustomDialogBox>
		</>
	)
}

export default ChooseTemplate

const TemplateCard = ({
	template,
	onTemplateSelect,
	currentTemplate,
}: {
	template: Template
	onTemplateSelect: Function
	currentTemplate: string | null
}) => {
	return (
		<button
			type="button"
			onClick={() => onTemplateSelect(template.id)}
			key={template.id}
			className="relative px-4 pt-4 pb-6 my-2 text-left rounded-2xl bg-slate-800">
			<div className="overflow-hidden relative w-full h-40 rounded">
				<Image
					src={(template?.bannerImage as string) || ""}
					alt={template.name}
					fill
				/>
			</div>

			{/* Name link and Price */}
			<div className="flex justify-between items-center pt-12">
				<div>
					<h2 className="text-2xl font-semibold">{template.name}</h2>
					{template.stripeProduct ? (
						<h3>
							{getSymbolFromCurrency(
								template.stripeProduct?.default_price?.currency as string
							)}{" "}
							{Number(template.stripeProduct?.default_price?.unit_amount) /
								100}
						</h3>
					) : (
						<h3>Free</h3>
					)}
				</div>
				{template.demoLink && (
					<Button rounded>
						<a
							href={template.demoLink}
							target="_blank"
							rel="noreferrer"
							className="flex items-center space-x-2">
							<span>View Demo</span>
							<ExternalLink size={16} />
						</a>
					</Button>
				)}
			</div>

			<input
				type="checkbox"
				onChange={e => {
					if (e.target.checked) {
						onTemplateSelect(template.id)
					}
					return null
				}}
				checked={currentTemplate === template.id}
				className="absolute top-4 right-4 w-8 h-8 bg-opacity-50 rounded-full border-2 appearance-none checked:bg-blue-500 bg-slate-400 border-slate-100 checked:text-slate-100"
			/>
			{/* <img src={template.bannerImage} alt={template.name} /> */}
			{/* <button onClick={_handleCreateSite}>Create Site</button> */}
		</button>
	)
}

const GET_TEMPLATES = gql`
	query GetTemplates {
		data: getTemplates {
			success
			message
			data {
				id
				name
				demoLink
				stripeProduct {
					default_price {
						currency
						unit_amount
						recurring {
							interval
						}
					}
				}
				bannerImage
				description
				creator
			}
		}
	}
`

export const getServerSideProps: GetServerSideProps = async context => {
	// Get siteName from context

	const { getToken } = await getAuth(context.req)

	try {
		const templates = await fetchWithToken<GraphQLResponse<TemplatesResponse>>({
			query: GET_TEMPLATES,
			variables: {},
			getToken,
		})

		// Debug
		console.log("templates res", JSON.stringify(templates, null, 2))

		return {
			props: {
				...buildClerkProps,
				templates: templates.data!.data,
			},
		}
	} catch (error: any) {
		// Debug
		console.debug("error", error)
		return {
			props: {
				...buildClerkProps,
				templates: [],
			},
		}
	}
}

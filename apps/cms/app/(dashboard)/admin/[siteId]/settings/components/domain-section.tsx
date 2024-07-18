"use client"

import { useAuth } from "@clerk/nextjs"
import Button from "components/Button"
import Input from "components/form/Input"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { useParams } from "next/navigation"
import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import useSWR from "swr"
import { Site, SiteDomainsResponse, VercelProjectDomain } from "types/generated/types"
import DomainCard from "./domain-card"

const DomainSection = ({ site }: { site: Site }) => {
	const { siteId } = useParams<{ siteId: string }>() ?? { siteId: "" }
	const { getToken } = useAuth()
	const [domain, setDomain] = useState("")

	const {
		data: domainsData,
		error: _domainError,
		mutate: domainsMutate,
	} = useSWR<GraphQLResponse<SiteDomainsResponse>>(
		[GET_ALL_SITE_DOMAINS, siteId],
		() =>
			fetchWithToken({
				query: GET_ALL_SITE_DOMAINS,
				variables: { id: siteId },
				getToken,
			}),
		{
			onSuccess: data => {
				console.log("existing domains", data)
			},
		}
	)

	const addNewDomain = useCallback(async () => {
		await fetchWithToken({
			query: ADD_DOMAIN,
			variables: { domainName: domain, siteId },
			getToken,
		})
	}, [domain, siteId, getToken])

	const handleSubmit = useCallback(() => {
		toast.promise(addNewDomain(), {
			loading: "Adding domain...",
			success: () => {
				setDomain("")
				domainsMutate()

				return "Domain added!"
			},
			error: () => {
				return "Error adding domain!"
			},
		})
	}, [addNewDomain, domainsMutate])

	return (
		<div className="py-8 px-8 pt-4 space-y-4 w-full rounded-xl bg-slate-900">
			<h2 className="text-2xl">Domain(s)</h2>
			<p className="mb-8 max-w-x">Add your own custom domains</p>
			<div className="flex gap-4 justify-between items-center w-full">
				<Input
					type="text"
					name="domain"
					value={domain}
					onChange={e => setDomain(e.target.value)}
					placeholder="www.example.com"
				/>
				<Button
					type="submit"
					variant="primary"
					onClick={() => handleSubmit()}
					className="min-w-fit">
					Add Domain
				</Button>
			</div>
			{/* Render Existing Domains */}
			{domainsData?.data?.data?.domains
				?.filter(domain => !domain.name.includes("vercel"))
				.map((domain: VercelProjectDomain) => (
					<DomainCard
						domain={domain}
						domainsMutate={domainsMutate}
						site={site}
					/>
				))}
		</div>
	)
}

export default DomainSection

const GET_ALL_SITE_DOMAINS = gql`
	# Write your query or mutation here
	query getAllSiteDomains($id: String!) {
		data: getAllSiteDomainsLinked(id: $id) {
			success
			message
			data {
				domains {
					name
					name
					apexName
					projectId
					redirect
					redirectStatusCode
					gitBranch
					updatedAt
					createdAt
					verified
					verification {
						type
						domain
						value
						reason
					}
				}
			}
		}
	}
`

const ADD_DOMAIN = gql`
	mutation AddCustomDomain($domainName: String!, $siteId: String!) {
		data: addCustomDomain(domainName: $domainName, siteId: $siteId) {
			success
			message
			statusCode
			data {
				id
				name
				setup
				customDomain {
					name
					apexName
					projectId
					redirect
					redirectStatusCode
					gitBranch
					updatedAt
					createdAt
					verified
					verification {
						type
						domain
						value
						reason
					}
				}
			}
		}
	}
`

"use client"

import { useAuth } from "@clerk/nextjs"
import Button from "components/Button"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { CheckCircle2, Info, Star } from "lucide-react"
import { useParams } from "next/navigation"
import { useCallback, useState } from "react"
import { ExternalLink, Loader, XCircle } from "react-feather"
import toast from "react-hot-toast"
import useSWR, { MutatorCallback } from "swr"
import {
    DomainConfigurationResponse,
    // DomainConfigurationResponse,
    DomainVerification,
    Site,
    SiteResponse,
    VercelProjectDomain
} from "types/generated/types"
import CopyToClipboard from "./copy-to-clipboard"

interface UIStateInterface {
    deleting: boolean
    refreshing: boolean
    makingPrimary: boolean
}

const checkApexDomain = (domain: VercelProjectDomain): boolean => {
    // write a function to check if domain.name is an apexDomain
    // if it is, return true
    // if it is not, return false

    const result =
        domain.name.split(".")[0] === "www" || domain.name.split(".").length < 3

    return result
}

const DomainCard = (props: {
    domain: VercelProjectDomain
    domainsMutate: MutatorCallback
    site: Site
}) => {
    const { getToken } = useAuth()
    const { siteId } = useParams<{ siteId: string }>() ?? { siteId: "" }
    const { domain, domainsMutate, site } = props

    const [UIState, setUIState] = useState<UIStateInterface>({
        deleting: false,
        refreshing: false,
        makingPrimary: false
    })

    const {
        data: domainConfig,
        error: domainConfigError,
        mutate: domainConfigMutate
    } = useSWR<GraphQLResponse<DomainConfigurationResponse>>(
        [CHECK_DOMAIN_CONFIGURATION, domain.name],
        () =>
            fetchWithToken({
                query: CHECK_DOMAIN_CONFIGURATION,
                variables: { domain: domain.name },
                getToken
            }),
        {
            refreshInterval: 10000,
            isPaused: () =>
                domain.apexName === "vercel.app" ||
                domain.apexName === "lokus.app" ||
                domain.apexName === "lokus.io"
        }
    )

    const isLoading = !domainConfigError && !domainConfig

    const handleDelete = useCallback(async () => {
        setUIState({ ...UIState, deleting: true })
        try {
            await fetchWithToken({
                query: DELETE_DOMAIN,
                variables: { domainName: domain.name, siteId },
                getToken
            })
            setUIState({ ...UIState, deleting: false })
            domainsMutate()
        } catch (error) {
            console.error(error)
            setUIState({ ...UIState, deleting: false })
        }
    }, [UIState, domain.name, domainsMutate, getToken, siteId])

    const updatePrimaryDomain = useCallback(async () => {
        const response = await fetchWithToken<GraphQLResponse<SiteResponse>>({
            query: UPDATE_PRIMARY_DOMAIN,
            variables: { domainName: domain.name, siteId },
            getToken
        })
        return response
    }, [domain.name, getToken, siteId])

    const handleUpdatePrimaryDomain = useCallback(async () => {
        toast.promise(updatePrimaryDomain(), {
            loading: "Updating Primary Domain",
            success: data => {
                setUIState({ ...UIState, makingPrimary: false })
                if (data.data?.success) {
                    domainsMutate()
                    return "Primary Domain Updated!"
                }
                throw new Error("Error updating primary domain!")
            },
            error: () => {
                setUIState({ ...UIState, makingPrimary: false })
                return "Error updating primary domain!"
            }
        })
    }, [UIState, domainsMutate, updatePrimaryDomain])

    const isPrimaryDomain = domain.name === site.primaryDomain

    const showButtons =
        !domain.name.includes("vercel") &&
        !domain.name.includes("lokus") &&
        !isPrimaryDomain

    const needsConfiguration =
        !domain.verified ||
        (domain.verification?.length ?? 0) > 0 ||
        domainConfig?.data?.data?.misconfigured

    const canBePrimaryDomain =
        !isPrimaryDomain &&
        domain.verified &&
        !domainConfig?.data?.data?.misconfigured

    return (
        <div className="px-8 pt-4 pb-6 space-y-2 w-full rounded-xl bg-slate-800/50">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                    {!needsConfiguration ? (
                        <div className="flex items-center">
                            <Button
                                className="px-1"
                                variant="tertiary"
                                href={`https://${domain.name}`}
                                target="_blank">
                                <h3 className="text-xl font-semibold text-text-100">
                                    {domain.name}
                                </h3>
                                <ExternalLink size="16" />
                            </Button>
                        </div>
                    ) : (
                        <h3 className="text-xl font-semibold text-text-100">
                            {domain.name}
                        </h3>
                    )}
                </div>
                {isPrimaryDomain && (
                    <p className="capitalize text-sm font-bold">
                        <Star className="inline-block mr-1" fill="yellow" />
                        <span>Primary Domain</span>
                    </p>
                )}
                {canBePrimaryDomain && (
                    <Button
                        onClick={() => handleUpdatePrimaryDomain()}
                        variant="tertiary">
                        Make Primary
                    </Button>
                )}
            </div>
            {domain.redirect && (
                <div className="flex items-center py-4 space-x-8 w-full">
                    <p className="text-sm bg-chrome-100">
                        Redirects to: {domain.redirect}
                    </p>
                </div>
            )}

            {needsConfiguration ? (
                <>
                    <div className="flex items-center py-4 space-x-8 w-full">
                        <div className="flex items-center space-x-2">
                            <XCircle color="red" />
                            <p className="text-sm font-bold text-red-500">
                                Invalid Configuration
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {domain.verified ? (
                                <>
                                    <CheckCircle2 className="text-blue-500" />
                                    <p className="text-sm font-bold text-blue-500">
                                        Verfied
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Info className="text-red-500" />
                                    <p className="text-sm font-bold text-red-500">
                                        Needs Verfication
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 mb-2">
                        <p>
                            Set the following record(s) on your DNS provider to
                            continue:
                        </p>
                    </div>
                    {domain?.verification?.map(verification =>
                        verficiationChallenge(verification)
                    )}

                    {/** If domain is verified to use, and invalid config:
                     * If it's an Apex Domain show the A Record
                     * else, show the CNAME record.
                     *  */}
                    {domain.verified &&
                        domainConfig?.data?.data?.misconfigured &&
                        (checkApexDomain(domain) ? (
                            <DNSRecordElement
                                name={ARecord.name}
                                type={ARecord.type}
                                value={ARecord.value}
                            />
                        ) : (
                            <DNSRecordElement
                                name={domain.name.split(".")[0] || ""}
                                type="CNAME"
                                value="cname.vercel-dns.com"
                            />
                        ))}
                </>
            ) : (
                <div className="flex items-center py-4 space-x-8 w-full">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 color="rgba(59,130,246,1)" />
                        <p className="text-sm font-bold text-blue-500">
                            Valid Configuration
                        </p>
                    </div>
                    {domain.gitBranch && (
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 color="rgba(59,130,246,1)" />
                            <p className="text-sm text-blue-500">
                                Assigned to: {domain.gitBranch}
                            </p>
                        </div>
                    )}
                </div>
            )}
            {showButtons && (
                <div className="flex justify-end items-center space-x-4 mt-4">
                    <Button
                        onClick={() => domainConfigMutate()}
                        variant="tertiary">
                        {isLoading ? (
                            <Loader className="animate-spin" height={16} />
                        ) : (
                            <span>Refresh</span>
                        )}
                    </Button>

                    <Button
                        disabled={UIState.deleting}
                        onClick={() => handleDelete()}
                        variant="secondary">
                        {UIState.deleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default DomainCard

const UPDATE_PRIMARY_DOMAIN = gql`
    mutation UpdatePrimaryDomain($domainName: String!, $siteId: ID!) {
        data: updatePrimaryDomain(domainName: $domainName, siteId: $siteId) {
            success
            message
            data {
                id
                primaryDomain
            }
        }
    }
`

const DELETE_DOMAIN = gql`
    mutation DeleteDomain($domainName: String!, $siteId: String!) {
        deleteCustomDomain(domainName: $domainName, siteId: $siteId) {
            success
            data {
                customDomain {
                    name
                    verified
                }
            }
        }
    }
`

const CHECK_DOMAIN_CONFIGURATION = gql`
    query checkDomainConfiguration($domain: String!) {
        data: getDomainConfiguration(domain: $domain) {
            success
            message
            data {
                configuredBy
                acceptedChallenges
                misconfigured
            }
        }
    }
`

const verficiationChallenge = (verification: DomainVerification) => (
    <div className="py-4 px-4 space-y-4 w-full rounded bg-slate-950">
        <div className="grid grid-cols-6 gap-2">
            <div className="col-span-1">
                <p className="text-sm font-semibold uppercase">Type</p>
                <p className="font-mono">{verification.type}</p>
            </div>
            <div className="col-span-2">
                <p className="text-sm font-semibold uppercase">Name</p>
                <div className="flex items-center">
                    <p className="w-full max-w-xl font-mono truncate">
                        {verification.domain}
                    </p>
                    <CopyToClipboard value={verification.domain} />
                </div>
            </div>
            <div className="col-span-3">
                <p className="text-sm font-semibold uppercase">Value</p>
                <div className="flex items-center">
                    <p className="w-full max-w-xl font-mono truncate">
                        {verification.value}
                    </p>
                    <CopyToClipboard value={verification.value} />
                </div>
            </div>
        </div>
        <p className="max-w-fit">Reason: {verification.reason}</p>
    </div>
)

interface DNSRecord {
    type: "A" | "CNAME"
    name: string
    value: string
}

const ARecord: DNSRecord = {
    type: "A",
    name: "@",
    value: "76.76.21.21"
}

const DNSRecordElement = (record: DNSRecord) => {
    const { type, name, value } = record
    return (
        <div className="flex items-center p-4 space-x-8 w-full rounded bg-slate-950">
            <div>
                <p className="text-sm font-semibold uppercase">Type</p>
                <p className="font-mono">{type}</p>
            </div>
            <div>
                <p className="text-sm font-semibold uppercase">Name</p>
                <p className="font-mono">{name}</p>
            </div>
            <div>
                <p className="text-sm font-semibold uppercase">Value</p>
                <div className="flex items-center space-x-1">
                    <p className="w-full max-w-xl font-mono truncate">
                        {value}
                    </p>
                    <CopyToClipboard value={value} />
                </div>
            </div>
        </div>
    )
}

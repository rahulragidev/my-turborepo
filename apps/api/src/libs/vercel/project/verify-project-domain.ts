// verifyProjectDomainVercel

import fetch from "node-fetch"
import { logger } from "logger"

import { URL } from "url"
import { VercelAccessToken, VercelTeamId } from "config"
import { VercelProjectDomain } from "../../../entities/site/types/vercel-domain.response"

const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VercelAccessToken}`
    }
}

const verifyProjectDomainVercel = async (
    idOrName: string,
    domain: string
): Promise<VercelProjectDomain | any> => {
    const endpoint = new URL(
        `https://api.vercel.com/v9/projects/${idOrName}/domains/${domain}/verify`
    )

    endpoint.searchParams.append("teamId", VercelTeamId)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()

        if (json.error) {
            throw new Error(json.error.message)
        }

        switch (json.code) {
            case 200:
                logger.info("success", json.message)
                break
            case 400:
                logger.warn("failed", json.message)
                logger.warn(
                    "One of the provided values in the request body is invalid. \n One of the provided values in the request query is invalid. \n The domain is not valid \n You can't set both a git branch and a redirect for the domain \n The domain can not be added because the latest production deployment for the project was not successful \n The domain redirect is not valid \n You can not set the production branch as a branch for your domain"
                )
                break
            case 402:
                // Alert admin
                logger.warn(
                    "The account was soft blocked for an unhandled reason \n The account is missing a payment method must be updated"
                )
                break
            case 403:
                logger.warn(
                    "You do not have permission to access this resource \n You don't have access to the domain you are adding"
                )
                break
            case 404:
                logger.warn(
                    "Vercel project not found with idOrName: ",
                    idOrName
                )
                break
        }

        logger.debug("domainVerification Response", json)
        return json
    } catch (error: any) {
        logger.error(error)
        return error
    }
}

export default verifyProjectDomainVercel

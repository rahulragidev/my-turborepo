import fetch from "node-fetch"
import { logger } from "logger"

import { AddDomainToProjectResponse } from "entities/domain/types/ domain-add-to-project.type"
import { URL } from "url"
import { VercelAccessToken, VercelTeamId } from "config"

const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VercelAccessToken}`
    },
    body: ""
}

const addDomainToProjectVercel = async (
    idOrName: string,
    domainName?: string,
    gitBranch?: string,
    redirect?: string,
    redirectStatusCode?: number
): Promise<AddDomainToProjectResponse | any> => {
    const endpoint = new URL(
        `https://api.vercel.com/v9/projects/${idOrName}/domains`
    )

    endpoint.searchParams.append("teamId", VercelTeamId)

    const body = {
        name: domainName,
        gitBranch,
        redirect,
        redirectStatusCode
    }

    options.body = JSON.stringify(body)

    logger.debug("→ Endpoint for addDomainToProject", endpoint)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()

        if (json.error) {
            logger.error("🚫 addDomainToProject Error", json)
            throw new Error(json.error.message)
        }

        switch (json.code) {
            case 200:
                logger.info("The domain was successfully added to the project")
                break
            case 400:
                logger.warn(
                    "One of the provided values in the request body is invalid. \n One of the provided values in the request query is invalid. \n The domain is not valid \n You can't set both a git branch and a redirect for the domain \n The domain can not be added because the latest production deployment for the project was not successful \n The domain redirect is not valid \n You can not set the production branch as a branch for your domain"
                )
                break
            case 402:
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
                logger.warn("Project not found")
                break
        }

        logger.debug(json, "🎉 addDomainToProject Successful")
        return json
    } catch (error) {
        logger.error(error)
        return error
    }
}

export default addDomainToProjectVercel

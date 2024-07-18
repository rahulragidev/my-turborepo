import fetch from "node-fetch"

import { URL } from "url"
import { VercelAccessToken, VercelTeamId } from "config"

const options = {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VercelAccessToken}`
    }
}

interface Response {
    [key: string]: unknown
}

const removeDomainFromProjectVercel = async (
    idOrName: string,
    domain?: string
): Promise<Response | any> => {
    const endpoint = new URL(
        `https://api.vercel.com/v9/projects/${idOrName}/domains/${domain}`
    )

    endpoint.searchParams.append("teamId", VercelTeamId)

    console.log("→ Endpoint for removedDomainFromProject", endpoint)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()

        if (json.error) {
            console.log("🚫 removedDomainFromProject Error", json)
            throw new Error(json.error.message)
        }

        switch (json.code) {
            case 200:
                console.log("The domain was successfully added to the project")
                break
            case 400:
                console.log(
                    "One of the provided values in the request body is invalid. \n One of the provided values in the request query is invalid. \n The domain is not valid \n You can't set both a git branch and a redirect for the domain \n The domain can not be added because the latest production deployment for the project was not successful \n The domain redirect is not valid \n You can not set the production branch as a branch for your domain"
                )
                break
            case 402:
                console.log(
                    "The account was soft blocked for an unhandled reason \n The account is missing a payment method must be updated"
                )
                break
            case 403:
                console.log(
                    "You do not have permission to access this resource \n You don't have access to the domain you are adding"
                )
                break
            case 404:
                console.log("Project not found")
                break
            default:
                console.log("Default JSON", json)
                break
        }

        console.log("🎉 removedDomainFromProject Successful", json)
        return json
    } catch (error) {
        console.log("🚫 removedDomainFromProject Error", error)
        return error
    }
}

export default removeDomainFromProjectVercel

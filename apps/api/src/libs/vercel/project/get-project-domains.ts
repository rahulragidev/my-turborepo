import fetch from "node-fetch"
import { URL } from "url"
import { VercelAccessToken, VercelTeamId } from "config"
import { VercelProjectDomainsResponse } from "entities/site/types/vercel-domain.response"
import { logger } from "logger"

const options = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VercelAccessToken}`
    }
}

const getProjectDomainsFromVercel = async (
    idOrName: string
): Promise<VercelProjectDomainsResponse | any> => {
    const endpoint = new URL(
        `https://api.vercel.com/v9/projects/${idOrName}/domains`
    )

    endpoint.searchParams.append("teamId", VercelTeamId)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()

        if (json.error) {
            throw new Error(json.error)
        }

        return json
    } catch (error: any) {
        logger.error(error, "🚫 getProjectDomains Error")
        return error
    }
}

export default getProjectDomainsFromVercel

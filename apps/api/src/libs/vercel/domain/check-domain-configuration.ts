import fetch from "node-fetch"

import { URL } from "url"
import { VercelAccessToken, VercelTeamId } from "config"
import { logger } from "logger"

const options = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VercelAccessToken}`
    },
    body: undefined
}

const checkDomainConfiguration = async (domain: string) => {
    const endpoint = new URL(
        `https://api.vercel.com/v6/domains/${domain}/config`
    )

    endpoint.searchParams.append("teamId", VercelTeamId)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()

        if (json.error) {
            const error = new Error()
            error.message = json.error.message
            throw error
        }
        return json
    } catch (error) {
        logger.error(error)

        return error
    }
}

export default checkDomainConfiguration

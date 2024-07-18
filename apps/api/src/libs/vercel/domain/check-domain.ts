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

const checkDomain = async (name: string) => {
    const endpoint = new URL(`https://api.vercel.com/v4/domains/status`)

    endpoint.searchParams.append("name", name)
    endpoint.searchParams.append("teamId", VercelTeamId)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()

        return json
    } catch (error) {
        logger.log(error)
        return error
    }
}

export default checkDomain

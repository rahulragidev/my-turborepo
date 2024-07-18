import fetch from "node-fetch"

import { URL } from "url"
import { VercelAccessToken, VercelTeamId } from "config"

const registerOrTransferInDomain = async (name: string, _method?: string) => {
    const endpoint = new URL(`https://api.vercel.com/v4/domains`)
    endpoint.searchParams.append("teamId", VercelTeamId)

    console.log("👉 Registering domain at:", endpoint)

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VercelAccessToken}`
        },
        body: ""
    }

    options.body = JSON.stringify({
        name
    })

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()
        console.log("✅ registerOrTransferInDomain response", json)
        if (json.error) {
            const error = new Error(json.error.message)
            throw error
        }
        return json
    } catch (error) {
        console.log("🚫Error registerOrTransferInDomain", error)
        return error
    }
}

export default registerOrTransferInDomain

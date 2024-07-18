import fetch from "node-fetch"

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

const purchaseDomainVercel = async (
    name: string,
    expectedPrice?: number,
    renew?: boolean
) => {
    const endpoint = new URL(`https://api.vercel.com/v4/domains/buy`)

    endpoint.searchParams.append("name", name)
    endpoint.searchParams.append("teamId", VercelTeamId)

    const body = {
        name,
        expectedPrice,
        renew
    }

    options.body = JSON.stringify(body)

    console.log("→ Endpoint for puchaseDomain", endpoint)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()

        if (json.error) {
            console.log("🚫 Purchase Domain Error", json)
            throw new Error(json.error.message)
        }

        if (json.code === 201) {
            console.log("🎉 Domain purchase succesful", json)
        }

        return json
    } catch (error) {
        console.log("🚫 Domain Purchase error", error)
        return error
    }
}

export default purchaseDomainVercel

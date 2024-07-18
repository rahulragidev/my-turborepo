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

const deleteDomainVercel = async (domain: string) => {
    const endpoint = new URL(`https://api.vercel.com/v4/domains/${domain}`)

    endpoint.searchParams.append("teamId", VercelTeamId)

    console.log("👉 deleteDomainVercel endpoint", endpoint)

    try {
        const response = await fetch(endpoint, options)
        const json = await response.json()
        console.log("status code: ", response.status)
        console.log(json)
        return json
    } catch (error) {
        console.log("🚫 deleteDomainVercel error", error)
        return error
    }
}

export default deleteDomainVercel

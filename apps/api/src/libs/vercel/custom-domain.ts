import fetch from "node-fetch"

import { VercelAccessToken, VercelTeamId } from "config"

const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VercelAccessToken}`
    },
    body: ""
}

// add custom domain to site on vercel api
const customDomain = async (domain: string, projectId: string) => {
    const url = `https://api.vercel.com/v8/projects/${projectId}/domains?teamId=${VercelTeamId}`
    const body = {
        domain
    }
    options.method = "POST"
    options.body = JSON.stringify(body)
    try {
        const response = await fetch(url, options)
        const json = await response.json()
        return json
    } catch (error) {
        console.log(error)
        return error
    }
}

export default customDomain

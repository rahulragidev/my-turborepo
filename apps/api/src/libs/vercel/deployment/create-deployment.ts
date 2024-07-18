import fetch from "node-fetch"

import { VercelAccessToken, VercelTeamId } from "config"
import { logger } from "logger"

const createDeployment = async ({
    body,
    forceNew
}: {
    body: IVercelCreateDeploymentBody
    forceNew?: boolean
}): Promise<IVercelCreateDeploymentResponse> => {
    const url = new URL("https://api.vercel.com/v13/deployments")
    url.searchParams.set("forceNew", forceNew ? "1" : "0")
    url.searchParams.set("teamId", VercelTeamId)

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${VercelAccessToken}`
            }
        })

        const json = await response.json()
        logger.log(json, `${response.status} ${response.statusText}`)

        return json
    } catch (error: any) {
        logger.error(error, "Vercel deployment error")
        return error
    }
}

export default createDeployment

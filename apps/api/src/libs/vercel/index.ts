import { FrameworkEnum } from "../../entities/template/types/framework.enum"
import {
    VercelAccessToken,
    VercelTeamId,
    publicGraphQlEndpoint,
    revalidationSecretKey
} from "config"
// import { FrameworkEnum } from "entities/template/types/framework.enum"
import fetch from "node-fetch"
import { ResponseSchema } from "types/response-schema.type"
// import { ResponseSchema } from "types/responseSchema.type"

const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VercelAccessToken}`
    },
    body: ""
}

export const getProject = async (
    id: string
): Promise<VercelProjectResponse> => {
    const url = `https://api.vercel.com/v8/projects/${id}?teamId=${VercelTeamId}`
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VercelAccessToken}`
        }
    }
    try {
        const project = await fetch(url, options)
        const json = project.json()
        return json
    } catch (error: any) {
        console.log("getProject error", error)
        return error.message
    }
}

/**
 * Create a new project on Vercel
 * @param name
 * @returns VercelProjectResponse | VercelError
 */
export const CreateProject = async (
    name: string
): Promise<VercelProjectResponse | VercelError> => {
    const url = `https://api.vercel.com/v8/projects?teamId=${VercelTeamId}`
    const body = {
        name
    }
    options.method = "POST"
    options.body = JSON.stringify(body)
    const response = await fetch(url, options)
    const json = await response.json()
    console.log("CreateVercelProject", json)
    return json
}

export const setProjectFramework = async (id: string): Promise<any> => {
    const url = `https://api.vercel.com/v8/projects/${id}?teamId=${VercelTeamId}`
    const body = {
        framework: FrameworkEnum.NEXTJS
    }
    options.method = "PATCH"
    options.body = JSON.stringify(body)
    try {
        const response = await fetch(url, options)
        const json = await response.json()
        return json
    } catch (error) {
        console.log("error", error)
        return error
    }
}

export const CreateProjectEnvironment = async (
    projectId: string,
    siteId: string
): Promise<any> => {
    const url = `https://api.vercel.com/v8/projects/${projectId}/env?teamId=${VercelTeamId}`
    const body = [
        {
            type: "plain",
            key: "NEXT_PUBLIC_SITE_ID",
            value: siteId,
            target: ["development", "production", "preview"]
        },
        {
            type: "plain",
            key: "NEXT_PUBLIC_API_ENDPOINT",
            value: publicGraphQlEndpoint,
            target: ["development", "production", "preview"]
        },
        {
            type: "plain",
            key: "REVALIDATION_SECRET_KEY",
            value: revalidationSecretKey,
            target: ["development", "production", "preview"]
        }
    ]
    options.method = "POST"
    options.body = JSON.stringify(body)
    try {
        const response = await fetch(url, options)
        const json = await response.json()
        return json
    } catch (error) {
        console.log("error", error)
        return error
    }
}

export const deleteProject = async (
    projectId: string
): Promise<ResponseSchema> => {
    // const url = `https://api.vercel.com/v12/now/deployments?teamId=${VercelTeamId}`
    const url = `https://api.vercel.com/v8/projects/${projectId}?teamId=${VercelTeamId}`
    options.method = "DELETE"
    try {
        const response = await fetch(url, options)
        // const json = await response.json()
        console.log("deleteProject Vercel API", response)

        if (response.status === 204) {
            return {
                success: true,
                message: "Deleted vercel project"
            }
        }
        return {
            success: true,
            message: "Vercel project deletion failed!"
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            data: error
        }
    }
}
//657aadee808ca3a6cbb622de
interface UpdateProjectDomainBody {
    gitBranch?: string
    redirect?: string
    redirectStatusCode?: number
}

export const updateProjectDomainVercel = async (
    idOrName: string,
    domainIdOrName: string,
    config?: UpdateProjectDomainBody
): Promise<any> => {
    const url = `https://api.vercel.com/v9/projects/${idOrName}/domains/${domainIdOrName}?teamId=${VercelTeamId}`
    options.method = "POST"
    try {
        const response = await fetch(url, options)
        options.body = JSON.stringify(config)

        const json = await response.json()

        if (json.error) {
            const error = new Error(json.error.message)
            throw error
        }
        return json
    } catch (error: any) {
        console.log("updateProjectDomainVercel error", error)
        return error
    }
}

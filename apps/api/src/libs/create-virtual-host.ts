/**
 *  🚫 DEPRECATED
 *  This was previously used to create a virtual host for a custom domain.
 *  This is now handled by the Vercel API.
 */

import axios from "axios"
import { VHostCreateResponse } from "types/approximated"

interface Root {
    data: VHostCreateResponse
}

const DEPRECATED_CreateVirtualHost = async (
    customDomain: string,
    projectUrl: string
): Promise<Root | any> => {
    try {
        const options = {
            method: "POST",
            url: "https://cloud.approximated.app/api/vhosts",
            headers: {
                "Content-Type": "application/json",
                "api-key": "7ae02ba2-d378-42f6-a617-9c2bf7dfc9f0-1641623204"
            },
            data: {
                incoming_address: customDomain,
                target_address: projectUrl
            }
        }

        const response = await axios.post(options.url, options.data, {
            headers: options.headers
        })

        if (!response.status) {
            throw new Error("No response from CreateVirtualHost")
        }
    } catch (error: any) {
        console.log("\n ------------------------------\n")
        console.log("👉 Create VirtualHost Error \n\n", error.response)
        console.log("\n ------------------------------\n")
    }
}

export default DEPRECATED_CreateVirtualHost

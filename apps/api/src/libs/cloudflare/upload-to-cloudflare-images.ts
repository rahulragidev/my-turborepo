import FormData from "form-data"
import axios from "axios"
import fs from "fs"

export const uploadToCloudflareImages = async (
    // binary file
    filePath: string
    //_context: AuthRequestContext
): Promise<ICloudFlareImageUploadResponse> => {
    console.log(`uploadToCloudFlare invoked: ${filePath}`)

    // Constructing form data
    const formData = new FormData()
    formData.append("file", fs.createReadStream(filePath) as any)

    // URL
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID}/images/v1`

    const response = (await axios.post(url, formData, {
        headers: {
            Authorization: "Bearer eJb_FOIEBWrFWXt-Gy5sYozvktAeLUQh8392tRw0",
            ...formData.getHeaders()
        }
    })) as { data: ICloudFlareImageUploadResponse }
    return response.data
}

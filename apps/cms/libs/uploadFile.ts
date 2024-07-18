import { Asset } from "types/generated/types"

interface AssetResponse {
	success: boolean
	message: string
	data?: Asset & { _id: string }
}

const UploadFile = async (file: File, token: string): Promise<AssetResponse> => {
	try {
		debugger
		if (!file)
			throw new Error(
				"File isn't present, don't know how you triggered this function :p"
			)

		// construct a from data with the files
		const fd = new FormData()
		fd.append("file", file)

		const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT as string
		const options = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: fd,
		}

		const res: Response = await fetch(apiUrl, options)
		const data: Asset & { _id: string } = await res.json()
		console.log("data uploaded", data)
		if (!res.ok) {
			const errorText = await res.text()
			throw new Error(`failed: ${res.statusText},\n error: ${errorText}`)
		}
		const { variants } = data
		console.log("response url", variants)
		return {
			success: true,
			message: "uploaded successfully",
			data: {
				...data,
				_id: data._id.toString(),
			},
		}
	} catch (error: any) {
		console.error(error)
		return {
			success: false,
			message: error.message,
		}
	}
}

export default UploadFile

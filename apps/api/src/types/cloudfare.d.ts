interface ICloudFlareImageUploadResponse {
    success: boolean;
    errors: ICloudflareErrorMessage[];
    messages: string[];
    result: {
        id: string;
        filename: string;
        uploaded: string;
        requireSignedURLs: boolean;
        variants: string[];
    };
}

interface ICloudflareErrorMessage {
    code: number;
    message: string;
}
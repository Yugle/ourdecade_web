import COS, { Part, UploadBody } from 'cos-js-sdk-v5'

const cosClient = new COS({
    SecretId: process.env.UMI_APP_COS_SECRET_ID,
    SecretKey: process.env.UMI_APP_COS_SECRET_KEY,
})

const cosConfig = {
    Bucket: process.env.UMI_APP_COS_SECRET_BUCKET!!,
    Region: process.env.UMI_APP_COS_SECRET_REGION!!,
}

export async function fetchUploadList() {
    return await cosClient.multipartList({
        ...cosConfig,
        Prefix: '1',
        Delimiter: '/',
    })
}

export async function initUpload(
    key: string,
): Promise<COS.MultipartInitResult> {
    return await cosClient.multipartInit({
        ...cosConfig,
        Key: key,
    })
}

export async function uploadFile(
    key: string,
    uploadId: string,
    partNumber: number,
    file: UploadBody,
): Promise<COS.MultipartUploadResult> {
    return await cosClient.multipartUpload({
        ...cosConfig,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: file,
    })
}

export async function completeUpload(
    key: string,
    uploadId: string,
    parts: Part[],
) {
    return await cosClient.multipartComplete({
        ...cosConfig,
        Key: key,
        UploadId: uploadId,
        Parts: parts,
    })
}

import COS from 'cos-js-sdk-v5'

const cosClient = new COS({
    SecretId: 'xxx',
    SecretKey: 'xxx',
})

const cosConfig = {
    Bucket: 'ourdecade-1256478858',
    Region: 'ap-nanjing',
}

export async function fetchUploadList() {
    return await cosClient.multipartList({
        ...cosConfig,
        Prefix: '1',
        Delimiter: '/',
    })
}

export async function initUpload(key: string, file: File) {
    return await cosClient.multipartInit({
        ...cosConfig,
        Key: '1.jpg',
        Body: file,
    })
}

export async function uploadFile(key: string, file: File) {
    return await cosClient.multipartUpload({
        ...cosConfig,
        Key: key,
        UploadId: 'exampleUploadId',
        PartNumber: 1,
        Body: file,
    })
}

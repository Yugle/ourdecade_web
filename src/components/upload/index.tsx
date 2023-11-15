import {
    CloudUploadOutlined,
    LoadingOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import { Button, Input, Progress, Upload, UploadFile, notification } from 'antd'
import { Part } from 'cos-js-sdk-v5'
import React, { useEffect, useState } from 'react'
import { completeUpload, initUpload, uploadFile } from '../../utils/cos'
import './index.less'

enum UPLOAD_STATUS {
    NOT_START,
    UPLOADING,
    UPLOADED,
    FAILED,
}

export default () => {
    const [fileList, setFileList] = useState<UploadFile<any>[]>()
    const [name, setName] = useState<string>()
    const [progress, setProgress] = useState(0)
    const [uploadingStatus, setUploadingStatus] = useState(
        UPLOAD_STATUS.NOT_START,
    )
    const [bandWidth, setBandWidth] = useState(0)

    const unableToDelete =
        uploadingStatus == UPLOAD_STATUS.UPLOADING ||
        uploadingStatus == UPLOAD_STATUS.UPLOADED

    const [api, contextHolder] = notification.useNotification()

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!unableToDelete) {
                return null
            }

            const errorMessage = '视频上传中，建议不要离开页面'
            api['error']({
                message: errorMessage,
            })
            ;(e || window.event).returnValue = errorMessage
            return errorMessage
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

    const beforeUpload = (file: File) => {
        if (!file.type.startsWith('video/')) {
            api['error']({
                message: '只支持上传视频文件',
            })

            return Upload.LIST_IGNORE
        }

        return false
    }

    const parseThumbnail = (fileList: UploadFile[]) => {
        const videoURL = URL.createObjectURL(fileList[0].originFileObj!!)
        const video = document.createElement('video')
        video.src = videoURL

        video.addEventListener('loadedmetadata', function () {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            video.currentTime = 1 // 截取第1秒
            video.addEventListener('seeked', function () {
                canvas
                    .getContext('2d')
                    ?.drawImage(video, 0, 0, canvas.width, canvas.height)

                const imageSrc = canvas.toDataURL('image/jpeg')
                const newFileList = [...fileList]
                newFileList[0].thumbUrl = imageSrc
                setFileList(newFileList)

                URL.revokeObjectURL(videoURL) // 释放资源
            })
        })
    }

    const hasFileSelected = fileList && fileList.length > 0

    const startUpload = async () => {
        if (!name || !hasFileSelected) {
            api['error']({
                message: '请先输入姓名并选择要上传的视频',
            })

            return
        }

        setUploadingStatus(UPLOAD_STATUS.UPLOADING)

        const fileToUpload = (fileList!![0] as UploadFile).originFileObj!!
        const nameList = fileToUpload.name.split('.')
        const key = name + '.' + nameList[nameList.length - 1]

        const chunkSize = 1024 * 1024 * 10 // 10m
        // const chunkSize = 1024 * 1024 // 1m
        const totalChunks = Math.ceil(fileToUpload.size / chunkSize)
        let currentChunk = 0

        const resOfUploadInit = await initUpload(key)
        const { UploadId: uploadId } = resOfUploadInit

        console.log(
            `File size: ${fileToUpload.size}, total chunks: ${totalChunks}`,
        )

        try {
            const uploadedChunkList: Part[] = []
            setBandWidth(0.1)
            while (currentChunk < totalChunks) {
                const startTime = new Date().getTime()

                const partNumber = currentChunk + 1
                const start = currentChunk * chunkSize
                const end = Math.min(start + chunkSize, fileToUpload.size)
                const chunk = fileToUpload.slice(start, end)

                const uploadRes = await uploadFile(
                    key,
                    uploadId,
                    partNumber,
                    chunk,
                )
                uploadedChunkList.push({
                    PartNumber: partNumber,
                    ETag: uploadRes.ETag,
                })

                setProgress(Math.floor((partNumber / totalChunks) * 100))

                const endTime = new Date().getTime()
                setBandWidth(chunk.size / (endTime - startTime) / 1000)

                currentChunk++
            }
            await completeUpload(key, uploadId, uploadedChunkList)
            setProgress(100)
            setUploadingStatus(UPLOAD_STATUS.UPLOADED)
            api['success']({
                message: '上传成功',
            })
        } catch (e) {
            setUploadingStatus(UPLOAD_STATUS.FAILED)
            api['error']({
                message: '上传失败',
            })
        } finally {
            setBandWidth(0)
        }
    }

    let uploadBtnText = '开始上传'
    switch (uploadingStatus) {
        case UPLOAD_STATUS.UPLOADING:
            uploadBtnText = '上传中'
            break
        case UPLOAD_STATUS.UPLOADED:
            uploadBtnText = '上传成功'
            break
        case UPLOAD_STATUS.FAILED:
            uploadBtnText = '重新上传'
            break
    }

    return (
        <>
            {contextHolder}
            你的名字：
            <Input
                className="nameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={5}
            />
            <Button
                className={
                    'uploadBtn ' +
                    (uploadingStatus == UPLOAD_STATUS.UPLOADED
                        ? 'uploadSuccessBtn'
                        : '')
                }
                type="primary"
                icon={
                    uploadingStatus == UPLOAD_STATUS.UPLOADING ? (
                        <LoadingOutlined />
                    ) : (
                        <CloudUploadOutlined />
                    )
                }
                onClick={startUpload}
                disabled={unableToDelete}
            >
                {uploadBtnText}
            </Button>
            <Upload
                className={unableToDelete ? 'unableToDeleteUpload' : ''}
                accept="video/*"
                listType={hasFileSelected ? 'picture' : 'picture-card'}
                beforeUpload={beforeUpload}
                fileList={fileList}
                maxCount={1}
                onChange={({ fileList }) => {
                    if (unableToDelete) {
                        api['error']({
                            message: '视频上传中或已上传，无法删除',
                        })
                        return
                    }

                    if (fileList.length > 0) {
                        parseThumbnail(fileList)
                    } else {
                        setFileList(fileList)
                    }
                }}
            >
                {!hasFileSelected && (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>选择视频</div>
                    </div>
                )}
            </Upload>
            {uploadingStatus != UPLOAD_STATUS.NOT_START && (
                <div className="progressAndSpeedWrapper">
                    <Progress percent={progress} />
                    <span className="speed">
                        上传速度：{bandWidth.toFixed(2)}Mb/s
                    </span>
                </div>
            )}
        </>
    )
}

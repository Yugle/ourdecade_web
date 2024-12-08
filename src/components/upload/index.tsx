import {
    CloudUploadOutlined,
    LoadingOutlined,
    VideoCameraAddOutlined,
} from '@ant-design/icons'
import { Button, Input, Progress, Upload, UploadFile, notification } from 'antd'
import { Part } from 'cos-js-sdk-v5'
import dayjs from 'dayjs'
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

    const unableToEdit =
        uploadingStatus == UPLOAD_STATUS.UPLOADING ||
        uploadingStatus == UPLOAD_STATUS.UPLOADED

    const [api, contextHolder] = notification.useNotification()

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!unableToEdit) {
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

    useEffect(() => {
        if (progress >= 100) {
            setUploadingStatus(UPLOAD_STATUS.UPLOADED)
            api['success']({
                message: '上传成功',
            })
        }
    }, [progress])

    const beforeUpload = (file: File) => {
        if (
            !file.type.startsWith('video/') &&
            !file.type.startsWith('image/')
        ) {
            api['error']({
                message: '只支持上传视频或图片',
            })

            return Upload.LIST_IGNORE
        }

        if (fileList?.some((f) => f.name === file.name)) {
            api['error']({
                message: '已存在同名文件',
            })

            return Upload.LIST_IGNORE
        }

        return false
    }

    const parseThumbnail = (file: UploadFile) => {
        const videoURL = URL.createObjectURL(file.originFileObj!!)
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
                file.thumbUrl = imageSrc
                const newFileList = [...(fileList || []), file]
                console.log({ newFileList })
                setFileList(newFileList)

                URL.revokeObjectURL(videoURL) // 释放资源
            })
        })
    }

    const hasFileSelected = fileList && fileList.length > 0

    const startUpload = async () => {
        if (!name || !hasFileSelected) {
            api['error']({
                message:
                    (name ? name + ', 请' : '请先输入姓名并') +
                    '至少选择一个要上传的视频',
            })

            return
        }

        setUploadingStatus(UPLOAD_STATUS.UPLOADING)

        let totalSize = 0
        fileList.forEach((f) => (totalSize += f.size || 0))

        const chunkSize = 1024 * 1024 * 10 // 10m
        // const chunkSize = 1024 * 1024 // 1m

        let uploadedChunkSize = 0

        try {
            setBandWidth(0.1)

            fileList.forEach(async (f) => {
                const fileToUpload = (f as UploadFile).originFileObj!!
                const key =
                    name + '_' + dayjs().unix() + '_' + fileToUpload.name
                console.log({ key })
                const totalChunks = Math.ceil(fileToUpload.size / chunkSize)
                let currentChunk = 0

                const resOfUploadInit = await initUpload(key)
                const { UploadId: uploadId } = resOfUploadInit

                console.log(
                    `File name: ${key}, size: ${fileToUpload.size}, total chunks: ${totalChunks}`,
                )

                const uploadedChunkList: Part[] = []
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

                    uploadedChunkSize += chunk.size
                    setProgress(
                        Math.floor((uploadedChunkSize / totalSize) * 100),
                    )

                    const endTime = new Date().getTime()
                    setBandWidth(chunk.size / (endTime - startTime) / 1000)

                    currentChunk++
                }
                await completeUpload(key, uploadId, uploadedChunkList)
            })
        } catch (e) {
            setUploadingStatus(UPLOAD_STATUS.FAILED)
            api['error']({
                message: '上传失败',
                description: '请再次尝试，如多次失败请联系管理员',
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
        <div className="upload-wrapper">
            {contextHolder}
            姓名：
            <Input
                className="nameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={5}
            />
            <Button
                className={'uploadBtn'}
                type="primary"
                icon={
                    uploadingStatus == UPLOAD_STATUS.UPLOADING ? (
                        <LoadingOutlined />
                    ) : (
                        <CloudUploadOutlined />
                    )
                }
                onClick={startUpload}
                disabled={unableToEdit}
            >
                {uploadBtnText}
            </Button>
            <Upload
                // multiple // 需要改下面生成缩略图的逻辑
                accept="video/*, image/*"
                listType={'picture'}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={({ file, fileList, event }) => {
                    if (unableToEdit) {
                        api['error']({
                            message: '视频上传中或已上传，无法删除',
                        })
                        return
                    }

                    setUploadingStatus(UPLOAD_STATUS.NOT_START)
                    if (
                        file.type?.startsWith('video/') &&
                        fileList.some((f) => f.uid == file.uid)
                    ) {
                        parseThumbnail(fileList[fileList.length - 1])
                    } else {
                        setFileList(fileList)
                    }
                }}
            >
                <Button
                    icon={<VideoCameraAddOutlined />}
                    disabled={unableToEdit}
                >
                    选择文件
                </Button>
            </Upload>
            {uploadingStatus != UPLOAD_STATUS.NOT_START && (
                <div className="progressAndSpeedWrapper">
                    <Progress percent={progress} />
                    <span className="speed">
                        上传速度：{bandWidth.toFixed(2)}Mb/s
                    </span>
                </div>
            )}
        </div>
    )
}

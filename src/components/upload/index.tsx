import {
    CheckOutlined,
    CloudUploadOutlined,
    CopyOutlined,
    LoadingOutlined,
    VideoCameraAddOutlined,
} from '@ant-design/icons'
import {
    Button,
    Input,
    Progress,
    Space,
    Upload,
    UploadFile,
    message,
    notification,
} from 'antd'
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
    const [isWeChat, setIsWeChat] = useState(false)
    const [copied, setCopied] = useState(false)

    const unableToEdit =
        uploadingStatus == UPLOAD_STATUS.UPLOADING ||
        uploadingStatus == UPLOAD_STATUS.UPLOADED

    const [api, contextHolder] = notification.useNotification()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ua = window.navigator.userAgent.toLowerCase()
            const isWxUA = /micromessenger/i.test(ua)
            const isDebug = /[?&](wx|wx_debug)=1/.test(window.location.search)
            if (isWxUA || isDebug) {
                setIsWeChat(true)
            }
        }
    }, [])

    useEffect(() => {
        if (isWeChat) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isWeChat])

    const handleCopyLink = () => {
        if (typeof window === 'undefined') return
        const url = window.location.href
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    setCopied(true)
                    message.success('链接已复制，请在浏览器中打开')
                    setTimeout(() => setCopied(false), 3000)
                })
                .catch(() => {
                    fallbackCopy(url)
                })
        } else {
            fallbackCopy(url)
        }
    }

    const fallbackCopy = (text: string) => {
        try {
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.top = '0'
            textArea.style.left = '0'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            message.success('链接已复制，请在浏览器中打开')
            setTimeout(() => setCopied(false), 3000)
        } catch (err) {
            message.error('复制失败，请点击右上角【···】并在浏览器中打开')
        }
    }

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!unableToEdit) {
                return null
            }

            const errorMessage = '视频上传中，建议不要离开页面'
            api['error']({
                message: errorMessage,
            })
                ; (e || window.event).returnValue = errorMessage
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

            {isWeChat && (
                <div className="wx-guide-overlay">
                    <div className="wx-guide-arrow-box">
                        <div className="wx-arrow-text">
                            点击右上角 <strong>···</strong>
                            <br />
                            选择 <strong>在浏览器打开</strong>
                        </div>
                        <svg
                            className="wx-arrow-svg"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M 8 52 C 20 52, 46 42, 48 14"
                                stroke="#ffffff"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M 32 20 L 48 10 L 56 26"
                                stroke="#ffffff"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div className="wx-guide-content">
                        <div className="wx-guide-desc">
                            微信上传会压缩视频画质
                            <br />
                            请使用手机浏览器打开
                        </div>
                        <Button
                            type="primary"
                            icon={
                                copied ? <CheckOutlined /> : <CopyOutlined />
                            }
                            className="wx-copy-btn"
                            onClick={handleCopyLink}
                        >
                            {copied ? '已复制' : '复制链接'}
                        </Button>
                    </div>
                </div>
            )}

            <span className="nameInputWrapper">
                姓名：
                <Input
                    className="nameInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={5}
                />
            </span>
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

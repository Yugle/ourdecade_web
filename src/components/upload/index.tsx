import { Button, Upload } from 'antd'
import React from 'react'

export default () => {
    const beforeUpload = async (file: File) => {
        const chunkSize = 1024 * 1024 * 1024 // 10m
        const totalChunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        // 截取第一秒画面作为缩略图

        while (currentChunk < totalChunks - 1) {
            const start = currentChunk * chunkSize
            const end = Math.min(start + chunkSize, file.size)
            const chunk = file.slice(start, end)
            // 上传
            currentChunk++
        }

        return false
    }

    return (
        <Upload beforeUpload={beforeUpload}>
            <Button>上传文件</Button>
        </Upload>
    )
}

import { Divider } from 'antd'
import React, { type FC } from 'react'
import { history } from 'umi'
import './index.less'

interface RequireContext {
    keys(): string[]
    <T>(id: string): T
    <T>(id: string, recursive: boolean): T
    resolve(id: string): string
}

declare const require: {
    context: (
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp,
    ) => RequireContext
    (id: string): any
    resolve(id: string): string
}

const Covers: FC = () => {
    // 获取/covers下所有图片文件
    const imageContext = require.context(
        '/public/covers',
        false,
        /\.(png|jpe?g|svg|webp)$/,
    )
    const imageNames = imageContext.keys()

    return (
        <>
            <Divider className="title-divider">
                <h2>往期封面</h2>
            </Divider>
            <div className="covers">
                {imageNames.map((imageName) => (
                    <img
                        key={imageName}
                        src={imageContext(imageName)}
                        onClick={() => {
                            history.push(imageName.split('.')[1])
                        }}
                    ></img>
                ))}
            </div>
        </>
    )
}

export default Covers

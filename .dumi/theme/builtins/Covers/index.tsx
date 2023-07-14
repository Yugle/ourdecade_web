import { Divider } from 'antd'
import React, { type FC } from 'react'
import './index.less'

const Covers: FC = () => {
    return (
        <>
            <Divider className="title-divider">
                <h2>往期封面</h2>
            </Divider>
            <img className="covers" src="/covers.webp"></img>
        </>
    )
}

export default Covers

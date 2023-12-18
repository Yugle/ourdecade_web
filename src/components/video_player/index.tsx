import BilibiliLogo from '@/assets/logo_bilibili.svg'
import YoutubeLogo from '@/assets/logo_youtube.svg'
import React from 'react'
import './index.less'

export enum Platform {
    Bilibili = 'Bilibili',
    YouTube = 'YouTube',
}

interface Props {
    src: string
    shareUrl: string
    platform: Platform
}

export default (props: Props) => {
    let icon = undefined
    switch (props.platform) {
        case Platform.Bilibili:
            icon = BilibiliLogo
            break
        case Platform.YouTube:
            icon = YoutubeLogo
            break
    }

    return (
        <>
            <div className="titleWrapper">
                <a href={props.shareUrl} target="_blank">
                    <img src={icon} alt={`去${props.platform}观看`}></img>
                </a>
            </div>
            <div className="videoWrapper">
                <iframe
                    className="videoPlayer"
                    src={props.src}
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                    sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
                ></iframe>
            </div>
        </>
    )
}

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Carousel } from 'antd'
import type { CarouselRef } from 'antd/es/carousel'
import React, { useRef, type FC } from 'react'
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
    const carouselRef = useRef<CarouselRef>(null)

    // 获取 /public/covers 下所有图片文件
    const imageContext = require.context(
        '/public/covers',
        false,
        /\.(png|jpe?g|svg|webp)$/,
    )

    // 提取年份并按降序排序（最新往期优先展示）
    const items = imageContext
        .keys()
        .map((key) => {
            const yearMatch = key.match(/(\d{4})/)
            const year = yearMatch ? yearMatch[1] : ''
            const link = key.split('.')[1] || `/${year}`
            return {
                key,
                year,
                link,
                src: imageContext(key),
            }
        })
        .sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0))

    if (!items.length) {
        return null
    }

    return (
        <div className="covers-wrapper covers-section">
            <div className="covers-carousel-container">
                <button
                    type="button"
                    className="carousel-nav-btn prev-btn"
                    onClick={() => carouselRef.current?.prev()}
                    aria-label="上一期封面"
                >
                    <LeftOutlined />
                </button>

                <Carousel
                    ref={carouselRef}
                    autoplay
                    autoplaySpeed={3200}
                    pauseOnHover
                    infinite
                    centerMode
                    centerPadding="0px"
                    slidesToShow={3}
                    dots={{ className: 'custom-dots' }}
                    responsive={[
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1,
                                centerMode: true,
                                centerPadding: '36px',
                            },
                        },
                    ]}
                >
                    {items.map((item) => (
                        <div key={item.key} className="slide-item-wrapper">
                            <div
                                className="cover-card"
                                onClick={() => history.push(item.link)}
                                role="button"
                                tabIndex={0}
                                title={`前往 ${item.year} 篇`}
                            >
                                <img
                                    src={item.src}
                                    alt={`${item.year}篇封面`}
                                    className="cover-img"
                                    loading="lazy"
                                />
                                <div className="cover-badge">
                                    <span className="badge-text">{item.year} 篇</span>
                                    <span className="badge-tip">观看</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>

                <button
                    type="button"
                    className="carousel-nav-btn next-btn"
                    onClick={() => carouselRef.current?.next()}
                    aria-label="下一期封面"
                >
                    <RightOutlined />
                </button>
            </div>
        </div>
    )
}

export default Covers

import { defineConfig } from 'dumi'

export default defineConfig({
    themeConfig: {
        name: 'Our Decade',
        favicon: '/favicon.ico',
        logo: '/logo.png',
        footer: `Copyright © 2020-Present Yugle | <a href="https://beian.miit.gov.cn/">鲁ICP备2021036616号-3</a>`,
        nav: [
            // null, 若为null, 则开启navs嗅探模式
            {
                title: '2024篇征集中',
                link: '/2024',
            },
            {
                title: '往期',
                link: '/summary',
            },
        ],
        socialLinks: {
            // github: 'https://github.com/Yugle/ourdecade_web',
        },
    },
    theme: { '@c-primary': '#1A73E8' },
    metas: [
        {
            name: 'viewport',
            content:
                'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
    ],
    extraBabelPlugins: [
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css',
                // style: true,
            },
            'antd',
        ],
    ],
})

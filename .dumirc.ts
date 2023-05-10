import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'Our Decade',
    favicon: '/favicon.ico',
    logo: '/logo.png',
    footer: `Copyright © 2020-Present Yugle | <a href="https://beian.miit.gov.cn/">鲁ICP备2021036616号-3</a>`,
    nav: [
      // null, 若为null, 则开启navs嗅探模式
      {
        title: '2022篇',
        link: '/2022',
      },
      {
        title: '往期',
        link: '/summary'
      }
      // {
      //   title: '往期',
      //   nav: [
      //     { title: '2020篇', link: '/2020' },
      //     { title: '2021篇', link: '/2021' },
      //   ],
      // },
      // { title: '胖虎的Blog', link: 'https://blog.ourdecade.cn' },
    ],
    socialLinks: {
      github: 'https://github.com/Yugle/ourdecade_web'
    }
  },
  theme: { '@c-primary': '#1A73E8' },
  metas: [
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
  ],
  styles: [
    `@media (max-width: 768px) {
      .videoWrapper {
          width: 100%;
          padding-bottom: 56.3%;
      }
    }
    @media (min-width: 769px) {
      .videoWrapper{
        width: 50%;
        padding-bottom: 33%; 
      }
    }
    .videoWrapper {
      position: relative;
    }    
    .videoPlayer {
      width: 100%;
      height: 100%;
      position: absolute;
    }

    iframe {
      width: 100%;
      height: 100%;
      position: absolute;
    }
    
    .dumi-default-header-content {
      gap: 40px;
    }
    
    .dumi-default-header-left {
      width: unset !important;
    }`,
  ],
});

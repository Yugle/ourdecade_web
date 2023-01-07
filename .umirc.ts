import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Our Decade',
  favicon: '/favicon.ico',
  logo: '/logo.png',
  outputPath: 'dist',
  mode: 'site',
  mfsu: {},
  dynamicImport: {
    loading: '/src/components/loading',
  },
  analytics: {
    ga: 'UA-214441743-1',
    baidu: '3a6fc54668c58586f68b7c17edc2a7a2',
  },
  navs: [
    // null, 若为null, 则开启navs嗅探模式
    {
      title: '2022篇',
      path: '/2022',
    },
    {
      title: '往期',
      children: [
        { title: '2020篇', path: '/2020' },
        { title: '2021篇', path: '/2021' },
      ],
    },
    { title: 'GitHub', path: 'https://github.com/Yugle/ourdecade_web' },
    { title: '胖虎的Blog', path: 'https://blog.ourdecade.cn' },
  ],
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
    }`,
  ],
});

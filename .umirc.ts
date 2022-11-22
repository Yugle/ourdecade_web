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
    baidu: 'a5b475ca39010117070ca762aa70685f',
  },
  navs: [
    // null, 若为null, 则开启navs嗅探模式
    {
      title: '2022篇征集中',
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
});

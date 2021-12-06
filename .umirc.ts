import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Our Decade',
  favicon: '/favicon.ico',
  logo: '/logo.png',
  outputPath: 'docs-dist',
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
    null,
    { title: 'GitHub', path: 'https://github.com/Yugle/ourdecade_web' },
    { title: '胖虎的Blog', path: 'https://blog.yugle.fun' },
  ],
});

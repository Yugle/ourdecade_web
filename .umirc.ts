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
    ga: 'G-3JS6FTX8FW',
  },
  navs: [
    null,
    { title: 'GitHub', path: 'https://github.com/Yugle/ourdecade_web' },
    { title: '胖虎的Blog', path: 'https://blog.yugle.fun' },
  ],
});

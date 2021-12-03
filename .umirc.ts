import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Our Decade',
  // favicon: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  // logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  mfsu: {},
  dynamicImport: {
    loading: '/src/components/loading',
  },
  navs: [
    null,
    { title: 'GitHub', path: 'https://github.com/Yugle/ourdecade_web' },
    { title: '胖虎的Blog', path: 'https://blog.yugle.fun' },
  ],
});

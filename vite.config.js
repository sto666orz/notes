import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/guide/
// vite.config.js # or vite.config.ts
// vite-plugin-import-context

const projectRootDir = path.resolve(__dirname);

export default {
  plugins: [vue()],
  alias: {
    // 键必须以斜线开始和结束
    // '@': path.resolve(projectRootDir, 'src'),
    '@assets': path.resolve(projectRootDir, 'src/assets'),
    '@components': path.resolve(projectRootDir, 'src/components'),
    '@pages': path.resolve(projectRootDir, 'src/pages'),
    '@utils': path.resolve(projectRootDir, 'src/utils'),
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
    // 是否自动在浏览器打开
    open: false,
    // 是否开启 https
    https: false,
    // 反向代理
    /* proxy: {
      '/api': {
        target: 'https://blog.csdn.net/weixin_45292658',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    } */
  },
  build: {
    // outDir: 'build',
    // assetsDir: 'assets',
    // sourcemap: false,
    // manifest: false
  },
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: './',
  // 服务端渲染
  ssr: false,
}

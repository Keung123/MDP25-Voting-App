import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin';

// https://vite.dev/config/
export default defineConfig({
  base: '/vote25/',
  plugins: [
    react(),
    // viteImagemin({
    //   gifsicle: { optimizationLevel: 3 },
    //   optipng: { optimizationLevel: 7 },

    //   // JPEG 更狠一点
    //   mozjpeg: {
    //     quality: 65,       // 60–70 之间都可以试
    //     progressive: true
    //   },

    //   // PNG 更狠一点
    //   pngquant: {
    //     quality: [0.2, 0.35], // 原来 0.4–0.55，往下再压
    //     speed: 1,             // 1 最慢压得最狠，4 稍快一点
    //     strip: true           // 去掉 metadata
    //   },

    //   // SVG
    //   svgo: {
    //     plugins: [
    //       { name: 'removeViewBox', active: false },
    //       { name: 'removeDimensions', active: true },
    //     ],
    //   },

    //   // WebP 也压一档
    //   webp: {
    //     quality: 65,    // 60–70
    //   },
    // })
  ],
})

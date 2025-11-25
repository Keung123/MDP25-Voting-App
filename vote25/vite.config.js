import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin';

// https://vite.dev/config/
export default defineConfig({
  base: '/vote25/',
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 }, // JPEG 压缩（数字越小越小）
      pngquant: { quality: [0.4, 0.55], },
      svgo: {},
      webp: { quality: 80 } // WebP 压缩
    })
  ],
})

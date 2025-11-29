import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';

// ESM 환경에서 __dirname 대체 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ 절대경로 설정
    },
  },

  server :{
    historyApiFallback: true, // 중요: SPA 라우팅 문제 방지
    open : true,
    port : 4000,
    //서버와의 통신을 위한 proxy 설정 > 
    proxy :{
      '/api' : {
        target : 'http://localhost:9090/api',
        changeOrigin : true,
        rewrite : (path) => path.replace(/^\/api/, '')
      }
    }
  }

})

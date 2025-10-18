import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // 🔥 FIX 1: Dùng VITE_ prefix để đảm bảo an toàn và tính năng Client-Side
    //           Tải tất cả các biến có prefix VITE_
    const env = loadEnv(mode, process.cwd(), 'VITE_'); 

    // Lấy key đã được load (PHẢI LÀ VITE_GEMINI_API_KEY)
    const API_KEY = env.VITE_GEMINI_API_KEY;

    // Tái cấu trúc env để đảm bảo code service của bạn nhận được key
    // dù Key không có prefix trong process.env.*
    
    return {
      server: {
        // 🔥 FIX 2: XÓA host: '0.0.0.0' và port: 3000 (Không cần thiết cho Vercel/Production)
      },
      plugins: [react()],
      define: {
        // 🔥 FIX 3: CHÈN KEY ĐÃ ĐƯỢC LOAD (VITE_GEMINI_API_KEY) vào biến process.env.API_KEY
        'process.env.API_KEY': JSON.stringify(API_KEY),
        // Xóa dòng process.env.GEMINI_API_KEY nếu không dùng
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
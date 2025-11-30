import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler']
                ],
            },
        }),
    ],
    server: {
        port: 3000,
        //// proxy settings for API calls to backend server but since we are using CORS in backend, it's not necessary
        //// it changes the origin of the request to the target URL
        //// http://localhost:3000 -> http://localhost:5000
        proxy: {
            '/api': 'http://localhost:5000',
            // changeOrigin: true,
        },
    },
})
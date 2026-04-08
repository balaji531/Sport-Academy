import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'admin-route-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin') {
            res.writeHead(301, { Location: '/admin/' });
            res.end();
            return;
          }
          if (req.url.startsWith('/admin/') && !req.url.includes('.')) {
            req.url = '/admin/index.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})

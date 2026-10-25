import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/mobile-api': {
        target: 'https://hachi.kelava.id',
        changeOrigin: true,
        secure: true,
        followRedirects: false,
        // One PHP entry point and one fixed controller, never a user-supplied target.
        bypass(req, res) {
          if (!['GET', 'POST', 'OPTIONS'].includes(req.method || '') ||
              !/^\/mobile-api\/index\.php\?r=apiMobileService\/[A-Za-z][A-Za-z0-9]*(?:&id_user=[1-9][0-9]*&id_client=[1-9][0-9]*)?$/.test(req.url || '')) {
            res.statusCode = 404;
            res.end('Invalid mobile API route');
            return false;
          }
        },
        rewrite: url => url.replace(/^\/mobile-api/, ''),
        configure(proxy) {
          proxy.on('proxyReq', request => {
            // Institution cookies/tokens must never be sent to the Mobile host.
            const allowed = new Set(['host', 'content-type', 'content-length', 'transfer-encoding', 'accept', 'connection']);
            for (const header of request.getHeaderNames()) if (!allowed.has(header.toLowerCase())) request.removeHeader(header);
          });
          proxy.on('proxyRes', response => {
            delete response.headers['set-cookie'];
            response.headers['cache-control'] = 'no-store';
            // Do not let an upstream redirect carry a POST to a different origin.
            if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
              response.statusCode = 502;
              delete response.headers.location;
            }
          });
        },
      },
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
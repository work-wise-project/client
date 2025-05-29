import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    preview: {
        port: 80,
        host: '0.0.0.0',
        allowedHosts: ['workwise.cs.colman.ac.il', 'localhost', '0.0.0.0'],
        https:
            process.env.NODE_ENV === 'production'
                ? {
                      key: process.env.HTTPS_KEY,
                      cert: process.env.HTTPS_CERT,
                  }
                : undefined,
    } as any,
});

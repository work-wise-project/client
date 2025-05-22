import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    preview: {
        port: 5173,
        host: '0.0.0.0',
        allowedHosts: ['workwise.cs.colman.ac.il', 'localhost', '0.0.0.0'],
    } as any,
});

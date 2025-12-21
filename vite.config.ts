import { defineConfig } from 'vite';

export default defineConfig({
    root: 'playground',
    server: {
        host: '0.0.0.0',
        port: 5173,
        open: false,
    },
});

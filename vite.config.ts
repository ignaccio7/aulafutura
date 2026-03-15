import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const TUNNELMOLE_LARAVEL = 'yifeaq-ip-181-115-172-26.tunnelmole.net';
// const TUNNELMOLE_VITE = 'vmg0fj-ip-181-115-172-26.tunnelmole.net';
const TUNNELMOLE_VITE = 'localhost';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: { plugins: ['babel-plugin-react-compiler'] },
        }),
        tailwindcss(),
        wayfinder({ formVariants: true }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: TUNNELMOLE_VITE, // ← solo hostname, sin protocolo
            // protocol: 'wss',
            // clientPort: 443,
        },
    },
});

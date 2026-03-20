import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// const TUNNELMOLE_VITE = 'lhzyzr-ip-181-115-172-26.tunnelmole.net'; // <- Esto solo descomentar si utilizamos https
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
            // protocol: 'wss', // <- Esto solo descomentar si utilizamos https
            // clientPort: 443, // <- Esto solo descomentar si utilizamos https
        },
    },
});

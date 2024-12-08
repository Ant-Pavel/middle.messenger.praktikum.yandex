import { defineConfig } from 'vite';
const path = require('path');

export default defineConfig({
    css: {
        postcss: './postcss.config.js'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    assetsInclude: ['**/*.jpeg'],
});

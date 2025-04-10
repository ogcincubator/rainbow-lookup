import {defineConfig} from "vite";

export default defineConfig({
    build: {
        lib: {
            name: 'RainbowLookup',
            entry: './src/main.ts',
            fileName: format => {
                if (format === 'umd') {
                    return 'rainbow-lookup.umd.js';
                }
                return `rainbow-lookup.${format}.js`;
            },
        },
        rollupOptions: {
            output: [
                {
                    format: 'es',
                    entryFileNames: 'rainbow-lookup.esm.js',
                },
                {
                    format: 'umd',
                    entryFileNames: 'rainbow-lookup.umd.js',
                    name: 'RainbowLookup',
                },
            ],
        },
        outDir: './dist-local',
        emptyOutDir: true,
    },
});
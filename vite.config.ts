import {defineConfig} from "vite";

export default defineConfig({
    build: {
        lib: {
            name: 'RainbowLookup',
            entry: './src/main.ts',
        }
    }
});
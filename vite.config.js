import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 16000, // 15 KB limit (increased from the default 4 KB)
  },
   alias: {
      'wavesurfer.js': 'wavesurfer.js/dist/wavesurfer.js',
    },
});


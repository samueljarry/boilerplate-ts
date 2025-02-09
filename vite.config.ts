import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@commands": path.resolve(__dirname, "./src/commands"),
      "@controllers": path.resolve(__dirname, "./src/controllers"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@managers": path.resolve(__dirname, "./src/managers"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@views": path.resolve(__dirname, "./src/views"),
      "@theaters": path.resolve(__dirname, "./src/theaters"),
      "@proxies": path.resolve(__dirname, "./src/proxies"),
      "@materials": path.resolve(__dirname, "./src/materials"),
      "@behaviors": path.resolve(__dirname, "./src/behaviors"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@public": path.resolve(__dirname, "./public"),
      "@mobile": path.resolve(__dirname, "./../mobile"),
    },
  },
});

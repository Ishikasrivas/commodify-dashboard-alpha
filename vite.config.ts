import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "commodify-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

// Minimal Vite plugin implementation for componentTagger
function componentTagger(): import('vite').Plugin {
  return {
    name: 'component-tagger',
    // Example: transform hook to tag React components (no-op here)
    transform(code, id) {
      if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
        // You could add custom logic here to tag components
        return code;
      }
      return null;
    },
  };
}


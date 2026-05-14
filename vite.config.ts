import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const removeOklabPlugin = () => {
  return {
    name: 'remove-oklab',
    enforce: 'post' as const,
    generateBundle(options: any, bundle: any) {
      for (const fileName in bundle) {
        if (fileName.endsWith('.css')) {
          const chunk = bundle[fileName];
          if (chunk.type === 'asset' && typeof chunk.source === 'string') {
            chunk.source = chunk.source.replace(/in oklab/g, 'in srgb').replace(/in oklch/g, 'in srgb');
          }
        }
      }
    },
    transform(code: string, id: string) {
      if (id.includes('.css')) {
        return code.replace(/in oklab/g, 'in srgb').replace(/in oklch/g, 'in srgb');
      }
    }
  };
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), removeOklabPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

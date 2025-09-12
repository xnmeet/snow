import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import path from 'node:path';

export default defineConfig({
  plugins: [pluginReact(), pluginNodePolyfill(), pluginSvgr()],
  environments: {
    web: {
      source: {
        entry: {
          // index: './src/side-panel/index.tsx',
          index: './src/side-panel/index.tsx',
        },
      },
      output: {
        target: 'web',
        sourceMap: true,
      },
    },
    iife: {
      source: {
        entry: {
          background: './src/scripts/background.ts',
          'stop-water-flow': './src/scripts/stop-water-flow.ts',
          'water-flow': './src/scripts/water-flow.ts',
        },
      },
      output: {
        target: 'web-worker',
        sourceMap: true,
        filename: {
          js: '../../scripts/[name].js',
        },
      },
    },
  },
  resolve: {
    alias: {
      async_hooks: path.join(__dirname, '../midscene/polyfill/blank_polyfill.ts'),
      'node:async_hooks': path.join(__dirname, '../midscene/polyfill/blank_polyfill.ts'),
    },
  },
  dev: {
    writeToDisk: true,
  },
  output: {
    polyfill: 'entry',
    injectStyles: true,
    copy: [
      { from: './src/static', to: './' },
      {
        from: '../midscene/dist-inspect',
        to: 'scripts',
      },
    ],
    externals: ['sharp'],
    sourceMap: true,
  },
  server: {
    port: 3000,
  },
});

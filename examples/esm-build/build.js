import { rmSync } from 'node:fs';

import { build as esbuild } from 'esbuild';

const buildInline = process.argv[2] === 'inline';

const langBase = 'monaco-editor/esm/vs/language';
const workers = [
  ['json', `${langBase}/json/json.worker.js`],
  ['css', `${langBase}/css/css.worker.js`],
  ['html', `${langBase}/html/html.worker.js`],
  ['ts', `${langBase}/typescript/ts.worker.js`],
  ['yaml', 'monaco-yaml/yaml.worker.js'],
].map(([k, p]) => ({
  entryPoints: [p],
  external: ['monaco-editor-core', `*/${k}Mode`, '*/monaco.contribution'],
}));
workers.push({ entryPoints: ['monaco-editor/esm/vs/editor/editor.worker.js'] });

rmSync('dist/', { force: true, recursive: true });

const options = {
  bundle: true,
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
};

if (!buildInline) {
  for (const { entryPoints, external } of workers) {
    esbuild({
      entryPoints,
      external,
      outdir: 'dist',
      format: 'iife',
      ...options,
    });
  }
}

function inlineWorkerPlugin() {
  return {
    name: 'inline-worker',
    setup(build) {
      build.onResolve({ filter: /\.worker\.js/ }, (args) => ({
        path: args.path,
        namespace: 'inline-worker',
      }));

      build.onLoad({ filter: /.*/, namespace: 'inline-worker' }, async (args) => {
        const out = await esbuild({
          ...options,
          entryPoints: [args.path],
          write: false,
          format: 'iife',
        });
        return {
          contents: out.outputFiles[0].contents,
          loader: 'binary',
        };
      });
    },
  };
}

esbuild({
  entryPoints: [buildInline ? 'esbuild-entry-inline.js' : 'esbuild-entry.js'],
  outfile: 'dist/editor.js',
  format: 'esm',
  ...options,
  loader: {
    '.ttf': 'file',
  },
  plugins: buildInline ? [inlineWorkerPlugin()] : undefined,
});

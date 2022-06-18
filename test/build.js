import esbuild from 'esbuild';

const entryPoints = [
  'monaco-editor/esm/vs/editor/editor.worker.js',
  './yaml.worker.js',
  './test/index.ts',
];

for (const entryPoint of entryPoints) {
  esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    minify: false,
    format: 'iife',
    sourcemap: 'linked',
    outdir: 'test/dist',
    legalComments: 'none',
    loader: {
      '.ttf': 'file',
    },
  });
}

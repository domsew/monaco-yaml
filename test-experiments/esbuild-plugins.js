import { promises as fs } from 'fs';
import { createRequire } from 'module';
import { resolve as pathResolve } from 'path';

import convertSourceMap from 'convert-source-map';
import esbuild from 'esbuild';
import { createInstrumenter } from 'istanbul-lib-instrument';

const require = createRequire(import.meta.url);

/**
 * @type {esbuild.Plugin}
 */
export const istanbulPlugin = {
  name: 'istanbul-plugin',
  setup(build) {
    const instrumenter = createInstrumenter({
      esModules: true,
      preserveComments: true,
    });

    build.onLoad({ filter: /\.[jt]s$/ }, async (args) => {
      if (/node_modules/.test(args.path)) {
        return;
      }
      const str = await fs.readFile(args.path, 'utf8');
      const transformResult = await esbuild.transform(str, { loader: 'ts' });
      // const conv = convertSourceMap.fromMapFileSource(str, process.cwd());
      const code = instrumenter.instrumentSync(transformResult.code, args.path);
      return {
        // contents: `${code}\n${conv.toComment()}`,
        contents: code,
        loader: 'js',
      };
    });
  },
};

/**
 * @type {esbuild.Plugin}
 */
export const aliasPlugin = {
  name: 'alias',
  setup({ onResolve, resolve }) {
    function resolveHelper(path, options = {}) {
      return { path: require.resolve(path), ...options };
    }

    onResolve({ filter: /\/schemaSelectionHandlers$/ }, () => ({
      path: pathResolve('./src/fillers/schemaSelectionHandlers.ts'),
    }));
    onResolve({ filter: /^vscode-languageserver(\/node|-protocol)?$/ }, () =>
      resolveHelper('vscode-languageserver-types', { sideEffects: false }),
    );
    onResolve({ filter: /^path$/ }, () =>
      resolveHelper('path-browserify', { sideEffects: false }),
    );
    onResolve({ filter: /^prettier/ }, ({ path }) =>
      resolveHelper(path === 'prettier' ? 'prettier/standalone.js' : `${path}.js`, {
        sideEffects: false,
      }),
    );
    onResolve({ filter: /vscode-nls/ }, () => ({
      path: pathResolve('./src/fillers/vscode-nls.ts'),
      sideEffects: false,
    }));
    onResolve({ filter: /\/umd\// }, ({ path, ...options }) =>
      resolve(path.replace(/\/umd\//, '/esm/'), options),
    );
    onResolve({ filter: /.*/ }, () => ({ sideEffects: false }));
  },
};

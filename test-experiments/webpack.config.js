import { resolve as pathResolve } from 'path';

import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default {
  entry: {
    index: './test-experiments/webpack-entry.js',
    // index: './webpack-entry.js',
  },
  output: {
    filename: '[name].js',
    path: pathResolve('./test-experiments', 'dist'),
    clean: true,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        type: 'asset',
      },
      {
        test: /\.m?js$/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['istanbul'],
          },
        },
      },
    ],
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['yaml'],
      customLanguages: [
        {
          label: 'yaml',
          entry: pathResolve('./index.js'),
          // entry: 'monaco-yaml',
          worker: {
            id: 'monaco-yaml/yamlWorker',
            entry: pathResolve('./yaml.worker.js'),
            // entry: 'monaco-yaml/yaml.worker',
          },
        },
      ],
    }),
  ],
};

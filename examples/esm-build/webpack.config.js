import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default {
  entry: {
    editor: './webpack-entry.js',
  },
  output: {
    filename: '[name].js',
    library: {
      type: 'module',
    },
    clean: true,
  },
  target: 'es2020',
  experiments: {
    outputModule: true,
  },
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
    ],
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['json', 'markdown', 'xml', 'html', 'handlebars', 'typescript', 'javascript'],
      customLanguages: [
        {
          label: 'yaml',
          entry: ['monaco-yaml', 'vs/basic-languages/yaml/yaml.contribution'],
          worker: {
            id: 'monaco-yaml/yamlWorker',
            entry: 'monaco-yaml/yaml.worker',
          },
        },
      ],
    }),
  ],
};

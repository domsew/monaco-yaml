import * as monaco from 'monaco-editor';
import { yamlDefaults } from 'monaco-yaml';

monaco.languages.yaml = { yamlDefaults };

export * as YAML from 'yaml';
export default monaco;

const workers = {
  yaml: 'yaml',
  json: 'json',
  css: 'css',
  scss: 'css',
  less: 'css',
  html: 'html',
  handlebars: 'html',
  razor: 'html',
  typescript: 'ts',
  javascript: 'ts',
  editorWorkerService: 'editor',
};

window.MonacoEnvironment = {
  getWorkerUrl(workerId, label) {
    const name = workers[label] ?? 'editor';
    return new URL(`${name}.worker.js`, import.meta.url);
  },
};

// eslint-disable-next-line unicorn/prefer-dom-node-append
const style = document.head.appendChild(document.createElement('link'));
style.rel = 'stylesheet';
style.href = new URL('editor.css', import.meta.url).href;
window.monaco = monaco;

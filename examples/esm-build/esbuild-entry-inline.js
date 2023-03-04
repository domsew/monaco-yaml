import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import { yamlDefaults } from 'monaco-yaml';
import YamlWorker from 'monaco-yaml/yaml.worker.js?worker';

export * as YAML from 'yaml';
export default monaco;

monaco.languages.yaml = { yamlDefaults };

const workers = {
  yaml: YamlWorker,
  json: JsonWorker,
  css: CssWorker,
  scss: CssWorker,
  less: CssWorker,
  html: HtmlWorker,
  handlebars: HtmlWorker,
  razor: HtmlWorker,
  typescript: TsWorker,
  javascript: TsWorker,
  editorWorkerService: EditorWorker,
};

window.MonacoEnvironment = {
  getWorker(workerId, label) {
    const uint8array = workers[label] ?? EditorWorker;
    const blob = new Blob([uint8array], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    URL.revokeObjectURL(url);
    return worker;
  },
};

// eslint-disable-next-line unicorn/prefer-dom-node-append
const style = document.head.appendChild(document.createElement('link'));
style.rel = 'stylesheet';
style.href = new URL('editor.css', import.meta.url).href;
window.monaco = monaco;

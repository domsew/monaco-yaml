import * as monaco from 'monaco-editor';
import { yamlDefaults } from 'monaco-yaml';
import * as YAML from 'yaml';

monaco.languages.yaml = { yamlDefaults };

export { YAML };
export default monaco;

window.monaco = monaco;
window.YAML = YAML;

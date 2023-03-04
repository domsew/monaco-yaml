declare module '*?worker' {
  const content: Uint8Array;
  export default content;
}

declare const monaco: import('monaco-editor/esm/vs/editor/editor.api');

declare module 'monaco-editor/esm/vs/editor/editor.api' {
  namespace languages.yaml {
    export const yamlDefaults: import('monaco-yaml').LanguageServiceDefaults;
  }
}

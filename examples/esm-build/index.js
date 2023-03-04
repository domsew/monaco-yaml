const { default: monaco } = await import('./dist/editor.js');

const schema = {
  fileMatch: ['*'],
  uri: 'http://schemas/my-schema.json',
  schema: {
    type: 'object',
    properties: {
      number: {
        description: 'number property',
        type: 'number',
      },
    },
  },
};

monaco.languages.yaml.yamlDefaults.setDiagnosticsOptions({
  schemas: [schema],
});
const value = `
number: 0xfe
boolean: true
`;
// JSON
//   monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
//     schemas: [schema],
//   });
//   const jsonValue = `{
//   "number": 100,
//   "boolean": true
// }`;

monaco.editor.create(document.querySelector('.editor'), {
  language: 'yaml',
  tabSize: 2,
  value,
});

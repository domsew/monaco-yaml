import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { setDiagnosticsOptions } from '../index.js';

const schema = {
  fileMatch: ['*'],
  uri: 'http://schemas/my-schema.json',
  schema: {
    type: 'object',
    properties: {
      p1: {
        description: 'number property',
        type: 'number',
      },
      p2: {
        type: 'boolean',
      },
    },
  },
};

setDiagnosticsOptions({
  schemas: [schema],
});
const value = 'p1: \np2: \n';

monaco.editor.create(document.querySelector('#editor'), {
  language: 'yaml',
  tabSize: 2,
  value,
});

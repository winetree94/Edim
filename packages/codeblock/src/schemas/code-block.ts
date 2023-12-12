import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

export const EDIM_CODEBLOCK_NODE_NAME = 'code_block';

const preDOM: DOMOutputSpec = [
  'pre',
  { class: 'edim-codeblock-wrapper' },
  [
    'code',
    {
      class: 'edim-codeblock-code',
    },
    0,
  ],
];

export const edimCodeBlockNodes = (): Record<string, NodeSpec> => ({
  [EDIM_CODEBLOCK_NODE_NAME]: {
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return preDOM;
    },
  },
});

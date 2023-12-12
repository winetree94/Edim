import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

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
  code_block: {
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

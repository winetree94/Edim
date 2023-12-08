import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

const preDOM: DOMOutputSpec = [
  'pre',
  { class: 'pmp-codeblock-wrapper' },
  [
    'code',
    {
      class: 'pmp-codeblock-code',
    },
    0,
  ],
];

export const PMP_CODE_BLOCK_NODE: Record<string, NodeSpec> = {
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
};

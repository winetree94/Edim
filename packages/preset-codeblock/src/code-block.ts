import { DOMOutputSpec, NodeSpec, NodeType } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';

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
const code_block: Record<string, NodeSpec> = {
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

/// Given a code block node type, returns an input rule that turns a
/// textblock starting with three backticks into a code block.
export function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```$/, nodeType);
}

export const CodeBlock = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...code_block,
    },
    marks: {},
    plugins: (schema) => [
      inputRules({
        rules: [codeBlockRule(schema.nodes['code_block'])],
      }),
      keymap({
        'Shift-Ctrl-\\': setBlockType(schema.nodes['code_block']),
      }),
    ],
  };
};

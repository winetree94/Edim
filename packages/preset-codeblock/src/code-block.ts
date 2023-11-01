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

/// Given a code block node type, returns an input rule that turns a
/// textblock starting with three backticks into a code block.
export function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```$/, nodeType);
}

export interface CreateCodeBlockPluginConfigs {
  nodeType: NodeType;
}

export const createCodeBlockPlugins = (
  configs: CreateCodeBlockPluginConfigs,
) => {
  return [
    inputRules({
      rules: [codeBlockRule(configs.nodeType)],
    }),
    keymap({
      'Shift-Ctrl-\\': setBlockType(configs.nodeType),
    }),
  ];
};

export const CodeBlock = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...PMP_CODE_BLOCK_NODE,
    },
    marks: {},
    plugins: (schema) =>
      createCodeBlockPlugins({
        nodeType: schema.nodes['code_block'],
      }),
  };
};

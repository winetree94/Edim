import { DOMOutputSpec, NodeSpec, NodeType } from 'prosemirror-model';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { setBlockType } from 'prosemirror-commands';
import { createPmpMergeAdjacentNodePlugins } from 'prosemirror-preset-core';

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
    ...createPmpMergeAdjacentNodePlugins({
      specs: [
        {
          nodeType: configs.nodeType,
          beforeMergeTransaction: (tr, joinPos) =>
            tr.insertText('\n', joinPos, joinPos + 1),
        },
      ],
    }),
  ];
};

import { wrapIn } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { DOMOutputSpec, NodeSpec, NodeType, Schema } from 'prosemirror-model';
import { wrappingInputRuleWithJoin } from 'prosemirror-preset-utils';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const blockquoteDOM: DOMOutputSpec = ['blockquote', 0];
export const PMP_BLOCKQUOTE_NODE: Record<string, NodeSpec> = {
  blockquote: {
    content: 'paragraph+',
    group: 'block disable-paragraph-attributes',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return blockquoteDOM;
    },
  },
};

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
export function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRuleWithJoin(/^\s*>\s$/, nodeType, { indent: 0 });
}

export interface CreateBlockQuotePluginConfigs {
  nodeType: NodeType;
}

export const createPmpBlockQuotePlugins = (
  configs: CreateBlockQuotePluginConfigs,
) => {
  return [
    inputRules({
      rules: [blockQuoteRule(configs.nodeType)],
    }),
    keymap({
      'Ctrl->': wrapIn(configs.nodeType),
    }),
  ];
};

export const BlockQuote = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...PMP_BLOCKQUOTE_NODE,
    },
    marks: {},
    plugins: (schema: Schema) =>
      createPmpBlockQuotePlugins({
        nodeType: schema.nodes['blockquote'],
      }),
  };
};

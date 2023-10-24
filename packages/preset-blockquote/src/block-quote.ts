import { wrapIn } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { DOMOutputSpec, NodeSpec, NodeType, Schema } from 'prosemirror-model';
import { wrappingInputRuleWithJoin } from 'prosemirror-preset-utils';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const blockquoteDOM: DOMOutputSpec = ['blockquote', 0];
const blockquote: Record<string, NodeSpec> = {
  blockquote: {
    content: 'block+',
    group: 'block',
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

export const BlockQuote = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...blockquote,
    },
    marks: {},
    plugins: (schema: Schema) => [
      inputRules({
        rules: [blockQuoteRule(schema.nodes['blockquote'])],
      }),
      keymap({
        'Ctrl->': wrapIn(schema.nodes['blockquote']),
      }),
    ],
  };
};

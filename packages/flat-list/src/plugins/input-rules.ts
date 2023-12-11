import { inputRules } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { wrappingInputRuleWithJoin } from '@edim-editor/core';
import { Plugin } from 'prosemirror-state';

/// Given a list node type, returns an input rule that turns a number
/// followed by a dot at the start of a textblock into an ordered list.
export const orderedListRule = (nodeType: NodeType) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return wrappingInputRuleWithJoin(/^(\d+)\.\s$/, nodeType, {
    indent: 0,
  });
};

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export const bulletListRule = (nodeType: NodeType) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return wrappingInputRuleWithJoin(/^\s*([-+*])\s$/, nodeType, {
    indent: 0,
  });
};

export interface EdimFlatListInputRulePluginConfigs {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
}

export const edimFlatListInputRulePlugins = (
  configs: EdimFlatListInputRulePluginConfigs,
): Plugin[] => [
  inputRules({
    rules: [
      orderedListRule(configs.orderListNodeType),
      bulletListRule(configs.bulletListNodeType),
    ],
  }),
];

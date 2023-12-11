import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType, { indent: 0 }, () => false);
}

export interface EdimBlockquoteInputRulePluginConfigs {
  nodeType: NodeType;
}

export const edimBlockquoteInputRulePlugins = (
  configs: EdimBlockquoteInputRulePluginConfigs,
): PMPlugin[] => [
  inputRules({
    rules: [blockQuoteRule(configs.nodeType)],
  }),
];

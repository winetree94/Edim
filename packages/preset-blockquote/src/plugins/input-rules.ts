import { inputRules } from 'prosemirror-inputrules';
import { Plugin as PMPlugin } from 'prosemirror-state';
import {
  wrappingInputRuleWithJoin,
} from 'prosemirror-preset-utils';
import { NodeType } from 'prosemirror-model';

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRuleWithJoin(/^\s*>\s$/, nodeType, { indent: 0 });
}

export interface PmpBlockquoteInputRulePluginConfigs {
  nodeType: NodeType;
}

export const createPmpBlockquoteInputRulePlugins = (
  configs: PmpBlockquoteInputRulePluginConfigs,
): PMPlugin[] => [inputRules({
  rules: [blockQuoteRule(configs.nodeType)],
})]
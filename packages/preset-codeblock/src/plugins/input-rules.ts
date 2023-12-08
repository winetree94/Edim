import { NodeType } from 'prosemirror-model';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';

export function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```$/, nodeType);
}

export interface PmpCodeBlockInputRulePluginConfigs {
  nodeType: NodeType;
}

export const createCodeBlockInputRulePlugins = (
  configs: PmpCodeBlockInputRulePluginConfigs,
) => {
  return [
    inputRules({
      rules: [codeBlockRule(configs.nodeType)],
    }),
  ];
};

import { NodeType } from 'prosemirror-model';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';

export function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```$/, nodeType);
}

export interface EdimCodeBlockInputRulePluginConfigs {
  nodeType: NodeType;
}

export const edimCodeBlockInputRulePlugins = (
  configs: EdimCodeBlockInputRulePluginConfigs,
) => {
  return [
    inputRules({
      rules: [codeBlockRule(configs.nodeType)],
    }),
  ];
};

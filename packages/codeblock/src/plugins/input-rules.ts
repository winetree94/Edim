import { NodeType } from 'prosemirror-model';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';

export interface EdimCodeBlockInputRulePluginConfigs {
  nodeType: NodeType;
}

export const edimCodeBlockInputRulePlugins = (
  configs: EdimCodeBlockInputRulePluginConfigs,
) => {
  return [
    inputRules({
      rules: [textblockTypeInputRule(/^```$/, configs.nodeType)],
    }),
  ];
};

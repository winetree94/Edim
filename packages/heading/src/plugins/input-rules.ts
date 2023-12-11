import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { headingRule } from '../input-rules';
import { inputRules } from 'prosemirror-inputrules';

export interface EdimHeadingInputRulePluginConfigs {
  nodeType: NodeType;
  level: number;
}

export const edimHeadingInputRulePlugins = (
  configs: EdimHeadingInputRulePluginConfigs,
): PMPlugin[] => {
  return [
    inputRules({
      rules: [headingRule(configs.nodeType, configs.level)],
    }),
  ];
};

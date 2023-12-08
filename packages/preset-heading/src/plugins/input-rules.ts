import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { headingRule } from '../input-rules';
import { inputRules } from 'prosemirror-inputrules';

export interface HeadingInputRuleConfigs {
  nodeType: NodeType;
  level: number;
}

export const createPmpHeadingInputRulePlugins = (
  configs: HeadingInputRuleConfigs,
): PMPlugin[] => {
  return [
    inputRules({
      rules: [headingRule(configs.nodeType, configs.level)],
    }),
  ];
};

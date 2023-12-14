import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { EDIM_DEFAULT_HEADING_LEVEL } from '../schemas';

export interface EdimHeadingInputRulePluginConfigs {
  nodeType: NodeType;
  level?: number;
}

export const edimHeadingInputRulePlugins = (
  configs: EdimHeadingInputRulePluginConfigs,
): PMPlugin[] => {
  const level = configs?.level || EDIM_DEFAULT_HEADING_LEVEL;
  return [
    inputRules({
      rules: [
        textblockTypeInputRule(
          new RegExp('^(#{1,' + level + '})\\s$'),
          configs.nodeType,
          (match) => ({ level: match[1].length }),
        ),
      ],
    }),
  ];
};

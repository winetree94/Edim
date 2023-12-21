import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { EdimHeadingNodeSpec } from '../schemas';

export interface EdimHeadingInputRulePluginConfigs {
  nodeType: NodeType;
}

export const edimHeadingInputRulePlugins = (
  configs: EdimHeadingInputRulePluginConfigs,
): PMPlugin[] => {
  const levels = (configs.nodeType.spec as EdimHeadingNodeSpec).meta.levels;
  const levelRegex = levels.map((level) => `#{${level}}`).join('|');
  return [
    inputRules({
      rules: [
        textblockTypeInputRule(
          new RegExp(`^(${levelRegex})\\s`),
          configs.nodeType,
          (match) => ({ level: match[1].length }),
        ),
      ],
    }),
  ];
};

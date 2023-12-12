import { NodeType } from 'prosemirror-model';
import { inputRules } from 'prosemirror-inputrules';
import { textblockTypeInputRule } from '@edim-editor/core';
import { checkCodeblockNodeType } from '../utils';

export interface EdimCodeBlockInputRulePluginConfigs {
  nodeType?: NodeType;
}

export const edimCodeBlockInputRulePlugins = (
  configs?: EdimCodeBlockInputRulePluginConfigs,
) => {
  return [
    inputRules({
      rules: [
        textblockTypeInputRule(
          /^```$/,
          checkCodeblockNodeType(configs?.nodeType),
        ),
      ],
    }),
  ];
};

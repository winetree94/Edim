import { inputRules } from 'prosemirror-inputrules';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { wrappingInputRule } from '@edim-editor/core';
import { checkBlockquoteNodeType } from '../utils';

export interface EdimBlockquoteInputRulePluginConfigs {
  nodeType?: NodeType;
}

export const edimBlockquoteInputRulePlugins = (
  configs?: EdimBlockquoteInputRulePluginConfigs,
): PMPlugin[] => [
  inputRules({
    rules: [
      wrappingInputRule(
        /^\s*>\s$/,
        checkBlockquoteNodeType(configs?.nodeType),
        { indent: 0 },
        () => false,
      ),
    ],
  }),
];

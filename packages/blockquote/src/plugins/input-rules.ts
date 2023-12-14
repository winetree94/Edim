import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export interface EdimBlockquoteInputRulePluginConfigs {
  nodeType: NodeType;
}

export const edimBlockquoteInputRulePlugins = (
  configs: EdimBlockquoteInputRulePluginConfigs,
): PMPlugin[] => [
  inputRules({
    rules: [
      wrappingInputRule(
        /^\s*>\s$/,
        configs.nodeType,
        { indent: 0 },
        () => false,
      ),
    ],
  }),
];

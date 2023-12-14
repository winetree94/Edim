import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

export interface EdimFlatListInputRulePluginConfigs {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
}

export const edimFlatListInputRulePlugins = (
  configs: EdimFlatListInputRulePluginConfigs,
): Plugin[] => [
  inputRules({
    rules: [
      wrappingInputRule(/^(\d+)\.\s$/, configs.orderListNodeType, {
        indent: 0,
      }),
      wrappingInputRule(/^\s*([-+*])\s$/, configs.bulletListNodeType, {
        indent: 0,
      }),
    ],
  }),
];

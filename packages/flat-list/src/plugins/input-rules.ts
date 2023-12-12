import { inputRules } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { wrappingInputRule } from '@edim-editor/core';
import { Plugin } from 'prosemirror-state';
import { checkBulletListNodeType, checkOrderedListNodeType } from '../utils';

export interface EdimFlatListInputRulePluginConfigs {
  orderListNodeType?: NodeType;
  bulletListNodeType?: NodeType;
}

export const edimFlatListInputRulePlugins = (
  configs?: EdimFlatListInputRulePluginConfigs,
): Plugin[] => [
  inputRules({
    rules: [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        checkOrderedListNodeType(configs?.orderListNodeType),
        {
          indent: 0,
        },
      ),
      wrappingInputRule(
        /^\s*([-+*])\s$/,
        checkBulletListNodeType(configs?.bulletListNodeType),
        {
          indent: 0,
        },
      ),
    ],
  }),
];

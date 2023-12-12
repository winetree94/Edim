import { inputRules } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { wrappingInputRuleWithJoin } from '@edim-editor/core';
import { Plugin } from 'prosemirror-state';
import { checkTaskListNodeType } from '../utils';

export interface EdimTaskListInputRulePluginConfigs {
  taskListNodeType?: NodeType;
}

export const edimTaskListInputRulePlugins = (
  configs?: EdimTaskListInputRulePluginConfigs,
): Plugin[] => [
  inputRules({
    rules: [
      wrappingInputRuleWithJoin(
        /^\[\]\s$/,
        checkTaskListNodeType(configs?.taskListNodeType),
        {
          indent: 0,
        },
      ),
      wrappingInputRuleWithJoin(
        /^\[x\]\s$/,
        checkTaskListNodeType(configs?.taskListNodeType),
        {
          indent: 0,
        },
        null,
        (wrappings) => {
          const [list, listItem] = wrappings;
          return [
            list,
            {
              ...listItem,
              attrs: {
                checked: true,
              },
            },
          ];
        },
      ),
    ],
  }),
];

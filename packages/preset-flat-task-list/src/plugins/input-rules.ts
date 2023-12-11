import { inputRules } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { wrappingInputRuleWithJoin } from '@edim-editor/core';
import { Plugin } from 'prosemirror-state';

export const checkedTaskListRule = (nodeType: NodeType) => {
  return wrappingInputRuleWithJoin(
    /^\[x\]\s$/,
    nodeType,
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
  );
};

export const uncheckedTaskListRule = (nodeType: NodeType) => {
  return wrappingInputRuleWithJoin(/^\[\]\s$/, nodeType, {
    indent: 0,
  });
};

export interface EdimTaskListInputRulePluginConfigs {
  taskListNodeType: NodeType;
}

export const edimTaskListInputRulePlugins = (
  configs: EdimTaskListInputRulePluginConfigs,
): Plugin[] => [
  inputRules({
    rules: [
      checkedTaskListRule(configs.taskListNodeType),
      uncheckedTaskListRule(configs.taskListNodeType),
    ],
  }),
];

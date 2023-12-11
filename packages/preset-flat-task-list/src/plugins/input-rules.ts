import { inputRules } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { wrappingInputRuleWithJoin } from 'prosemirror-preset-core';
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

export interface createEdimTaskListInputRulePluginsConfig {
  taskListNodeType: NodeType;
}

export const createEdimTaskListInputRulePlugins = (
  configs: createEdimTaskListInputRulePluginsConfig,
): Plugin[] => [
  inputRules({
    rules: [
      checkedTaskListRule(configs.taskListNodeType),
      uncheckedTaskListRule(configs.taskListNodeType),
    ],
  }),
];

import { inputRules } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { wrappingInputRuleWithJoin } from 'prosemirror-preset-core';
import { Plugin } from 'prosemirror-state';

export const checkedTaskListRule = (nodeType: NodeType) => {
  return wrappingInputRuleWithJoin(/^\[x\]\s$/, nodeType, {
    indent: 0,
    checked: true,
  });
};

export const uncheckedTaskListRule = (nodeType: NodeType) => {
  return wrappingInputRuleWithJoin(/^\[\]\s$/, nodeType, {
    indent: 0,
    checked: false,
  });
};

export interface createPmpTaskListInputRulePluginsConfig {
  taskListNodeType: NodeType;
}

export const createPmpTaskListInputRulePlugins = (
  configs: createPmpTaskListInputRulePluginsConfig,
): Plugin[] => [
  inputRules({
    rules: [
      checkedTaskListRule(configs.taskListNodeType),
      uncheckedTaskListRule(configs.taskListNodeType),
    ],
  }),
];

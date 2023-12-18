import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';

export interface EdimFlatListInputRulePluginConfigs {
  orderListNodeType?: NodeType;
  bulletListNodeType?: NodeType;
}

export const edimFlatListInputRulePlugins = (
  configs: EdimFlatListInputRulePluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [];

  if (configs.orderListNodeType) {
    plugins.push(
      inputRules({
        rules: [
          wrappingInputRule(/^(\d+)\.\s$/, configs.orderListNodeType, {
            indent: 0,
          }),
        ],
      }),
    );
  }

  if (configs.bulletListNodeType) {
    plugins.push(
      inputRules({
        rules: [
          wrappingInputRule(/^\s*([-+*])\s$/, configs.bulletListNodeType, {
            indent: 0,
          }),
        ],
      }),
    );
  }

  return plugins;
};

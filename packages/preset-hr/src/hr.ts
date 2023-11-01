import { keymap } from 'prosemirror-keymap';
import { DOMOutputSpec, NodeSpec, NodeType } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const hrDOM: DOMOutputSpec = ['hr'];
export const PMP_HORIZONTAL_RULE_NODE: Record<string, NodeSpec> = {
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    },
  },
};

export interface CreatePmpHorizontalRulePluginConfigs {
  nodeType: NodeType;
}

export const createPmpHorizontalRulePlugins = (
  configs: CreatePmpHorizontalRulePluginConfigs,
) => {
  return [
    keymap({
      'Mod-_': (state, dispatch) => {
        if (dispatch) {
          dispatch(
            state.tr
              .replaceSelectionWith(configs.nodeType.create())
              .scrollIntoView(),
          );
        }
        return true;
      },
    }),
  ];
};

export const Separator = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...PMP_HORIZONTAL_RULE_NODE,
    },
    marks: {},
    plugins: (schema) =>
      createPmpHorizontalRulePlugins({
        nodeType: schema.nodes['horizontal_rule'],
      }),
  };
};

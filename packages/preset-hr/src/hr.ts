import { keymap } from 'prosemirror-keymap';
import { DOMOutputSpec, NodeSpec, NodeType } from 'prosemirror-model';

const hrDOM: DOMOutputSpec = ['hr'];
export const EDIM_HORIZONTAL_RULE_NODES: Record<string, NodeSpec> = {
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    },
  },
};

export interface CreateEdimHorizontalRulePluginConfigs {
  nodeType: NodeType;
}

export const createEdimHorizontalRulePlugins = (
  configs: CreateEdimHorizontalRulePluginConfigs,
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

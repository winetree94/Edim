import { keymap } from 'prosemirror-keymap';
import { DOMOutputSpec, NodeSpec, NodeType } from 'prosemirror-model';

const hrDOM: DOMOutputSpec = ['hr'];
export const edimHorizontalRuleNodes = (): Record<string, NodeSpec> => ({
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    },
  },
});

export interface EdimHorizontalRulePluginConfigs {
  nodeType: NodeType;
}

export const edimHorizontalRulePlugins = (
  configs: EdimHorizontalRulePluginConfigs,
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

import { keymap } from 'prosemirror-keymap';
import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const hrDOM: DOMOutputSpec = ['hr'];
const horizontal_rule: Record<string, NodeSpec> = {
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    },
  },
};

export const Separator = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...horizontal_rule,
    },
    marks: {},
    plugins: () => [
      keymap({
        'Mod-_': (state, dispatch) => {
          if (dispatch) {
            dispatch(
              state.tr
                .replaceSelectionWith(
                  state.schema.nodes['horizontal_rule'].create(),
                )
                .scrollIntoView(),
            );
          }
          return true;
        },
      }),
    ],
  };
};

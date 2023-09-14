import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';
import { chainCommands, exitCode } from 'prosemirror-commands';
import { mac } from 'prosemirror-preset-utils';

const brDOM: DOMOutputSpec = ['br'];
const hard_break: Record<string, NodeSpec> = {
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM;
    },
  },
};

export const HardBreak = (): PMPluginsFactory => () => {
  return {
    nodes: {
      ...hard_break,
    },
    marks: {},
    plugins: (schema) => {
      const br = schema.nodes['hard_break'];
      const cmd = chainCommands(exitCode, (state, dispatch) => {
        if (dispatch)
          dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
        return true;
      });
      return [
        keymap({
          'Mod-Enter': cmd,
          'Shift-Enter': cmd,
          ...(mac ? { 'Ctrl-Enter': cmd } : {}),
        }),
      ];
    },
  };
};

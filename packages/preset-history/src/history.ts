import { history, redo, undo } from 'prosemirror-history';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';

export const HistoryExtension = (): PMPluginsFactory => () => {
  return {
    nodes: {},
    marks: {},
    plugins: () => [
      history(),
      keymap({
        'Mod-z': undo,
        'Shift-Mod-z': redo,
      }),
    ],
  };
};

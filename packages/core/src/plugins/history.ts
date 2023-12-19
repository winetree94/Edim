import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

export const edimHistoryPlugins = (): Plugin[] => {
  return [
    history(),
    keymap({
      'Mod-z': undo,
      'Shift-Mod-z': redo,
    }),
  ];
};

import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';

export const edimBasicKeymapPlugins = (): Plugin[] => {
  return [keymap(baseKeymap)];
};

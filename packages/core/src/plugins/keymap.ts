import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';

export interface EdimBasicKeymapPluginConfigs {}

export const edimBasicKeymapPlugins = (
  configs?: EdimBasicKeymapPluginConfigs,
): Plugin[] => {
  return [keymap(baseKeymap)];
};

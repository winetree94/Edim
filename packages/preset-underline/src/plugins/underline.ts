import { MarkType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimUnderlineKeymapPlugins } from './keymap';

export interface EdimUnderlinePluginConfigs {
  markType: MarkType;
}

export const edimUnderlinePlugins = (
  configs: EdimUnderlinePluginConfigs,
): PMPlugin[] => {
  return [...edimUnderlineKeymapPlugins(configs)];
};

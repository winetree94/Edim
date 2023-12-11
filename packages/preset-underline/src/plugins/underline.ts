import { MarkType } from 'prosemirror-model';
import { Plugin as EDIMlugin } from 'prosemirror-state';
import { createEdimUnderlineKeymapPlugins } from './keymap';

export interface EdimUnderlinePluginConfigs {
  markType: MarkType;
}

export const createEdimUnderlinePlugins = (
  configs: EdimUnderlinePluginConfigs,
): EDIMlugin[] => {
  return [...createEdimUnderlineKeymapPlugins(configs)];
};

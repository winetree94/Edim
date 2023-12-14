import { MarkType } from 'prosemirror-model';
import { edimSuperscriptKeymapPlugins } from './keymap';

export interface EdimSuperscriptPluginConfigs {
  markType: MarkType;
}

export const edimSuperscriptPlugins = (
  configs: EdimSuperscriptPluginConfigs,
) => {
  return [...edimSuperscriptKeymapPlugins(configs)];
};

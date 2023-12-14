import { MarkType } from 'prosemirror-model';
import { edimStrikethroughKeymapPlugins } from './keymap';

export interface EdimStrikethroughPluginConfigs {
  markType: MarkType;
}

export const edimStrikethroughPlugins = (
  configs: EdimStrikethroughPluginConfigs,
) => {
  return [...edimStrikethroughKeymapPlugins(configs)];
};

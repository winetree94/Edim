import { MarkType } from 'prosemirror-model';
import { edimStrikethroughKeymapPlugins } from './keymap';

export interface CreateEdimStrikethroughPluginConfigs {
  markType: MarkType;
}

export const createEdimStrikethroughPlugins = (
  configs: CreateEdimStrikethroughPluginConfigs,
) => {
  return [...edimStrikethroughKeymapPlugins(configs)];
};

import { MarkType } from 'prosemirror-model';
import { createEdimStrikethroughKeymapPlugins } from './keymap';

export interface CreateEdimStrikethroughPluginConfigs {
  markType: MarkType;
}

export const createEdimStrikethroughPlugins = (
  configs: CreateEdimStrikethroughPluginConfigs,
) => {
  return [...createEdimStrikethroughKeymapPlugins(configs)];
};

import { MarkType } from 'prosemirror-model';
import { createEdimSubscriptKeymapPlugins } from './keymap';

export interface CreateEdimSubscriptPluginConfigs {
  markType: MarkType;
}

export const createEdimSubscriptPlugins = (
  configs: CreateEdimSubscriptPluginConfigs,
) => {
  return [...createEdimSubscriptKeymapPlugins(configs)];
};

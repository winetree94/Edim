import { MarkType } from 'prosemirror-model';
import { createPmpSubscriptKeymapPlugins } from './keymap';

export interface CreatePmpSubscriptPluginConfigs {
  markType: MarkType;
}

export const createPmpSubscriptPlugins = (
  configs: CreatePmpSubscriptPluginConfigs,
) => {
  return [...createPmpSubscriptKeymapPlugins(configs)];
};

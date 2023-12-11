import { MarkType } from 'prosemirror-model';
import { createEdimCodeKeymapPlugins } from './keymap';
import { createEdimCodeInputRulePlugins } from './input-rules';

export interface CreateEdimCodePluginConfigs {
  markType: MarkType;
}

export const createEdimCodePlugins = (configs: CreateEdimCodePluginConfigs) => {
  return [
    ...createEdimCodeKeymapPlugins(configs),
    ...createEdimCodeInputRulePlugins(configs),
  ];
};

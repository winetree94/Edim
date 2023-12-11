import { MarkType } from 'prosemirror-model';
import { edimCodeKeymapPlugins } from './keymap';
import { edimCodeInputRulePlugins } from './input-rules';

export interface EdimCodePluginConfigs {
  markType: MarkType;
}

export const edimCodePlugins = (configs: EdimCodePluginConfigs) => {
  return [
    ...edimCodeKeymapPlugins(configs),
    ...edimCodeInputRulePlugins(configs),
  ];
};

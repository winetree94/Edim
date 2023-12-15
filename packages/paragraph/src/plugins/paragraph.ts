import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimParagraphKeymapPlugins } from './keymaps';

export interface EdimParagraphPluginConfigs {
  nodeType: NodeType;
  shortcutKey?: string | false;
}

export const edimParagraphPlugins = (
  configs: EdimParagraphPluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [];

  if (configs.shortcutKey !== false) {
    plugins.push(
      ...edimParagraphKeymapPlugins({
        nodeType: configs.nodeType,
        shortcutKey: configs.shortcutKey,
      }),
    );
  }

  return plugins;
};

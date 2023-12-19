import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimParagraphKeymapPlugins } from './keymaps';

export interface EdimParagraphPluginConfigs {
  nodeType: NodeType;
}

export const edimParagraphPlugins = (
  configs: EdimParagraphPluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [];

  plugins.push(
    ...edimParagraphKeymapPlugins({
      nodeType: configs.nodeType,
    }),
  );

  return plugins;
};

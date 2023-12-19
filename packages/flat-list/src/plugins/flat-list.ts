import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimFlatListInputRulePlugins } from './input-rules';
import { edimFlatListKeymapPlugins } from './keymaps';
import { edimFlatListMergePlugins } from './merge';

export interface EdimFlatListPluginConfigs {
  orderedListNodeType?: NodeType;
  bulletListNodeType?: NodeType;
  listItemNodeType: NodeType;
}

export const edimFlatListPlugins = (
  configs: EdimFlatListPluginConfigs,
): PMPlugin[] => {
  return [
    ...edimFlatListKeymapPlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderedListNodeType,
      listItemNodeType: configs.listItemNodeType,
    }),
    ...edimFlatListInputRulePlugins({
      bulletListNodeType: configs.bulletListNodeType,
      orderListNodeType: configs.orderedListNodeType,
    }),
    ...edimFlatListMergePlugins(configs),
  ];
};

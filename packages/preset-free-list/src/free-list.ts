import { NodeType, Schema } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { keymap } from 'prosemirror-keymap';
import { indentListItem, splitListItem } from './commands';
import { Plugin, PluginKey } from 'prosemirror-state';
import {
  PMP_BULLET_FREE_LIST_NODE,
  PMP_FREE_LIST_ITEM_NODE,
  PMP_ORDERED_FREE_LIST_NODE,
} from './schemas';
import { createPmpListInputRulePlugins } from './plugins';

export interface FreeListPluginConfigs {}

export interface createPmpFreeListPluginsConfig {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createPmpFreeListPlugins = (
  configs: createPmpFreeListPluginsConfig,
) => {
  return [
    createPmpListInputRulePlugins({}),
    keymap({
      Enter: splitListItem(configs.listItemNodeType),
      'Shift-Enter': splitListItem(configs.listItemNodeType),
      Tab: indentListItem(1),
      'Shift-Tab': indentListItem(-1),
    }),
    // TODO to flat list
    new Plugin({
      key: new PluginKey('freelist'),
      props: {
        transformPastedHTML(html, view) {
          const dom = new DOMParser().parseFromString(html, 'text/html');
          return dom.documentElement.innerHTML;
        },
      },
    }),
  ];
};

export const FreeList =
  (pluginConfig: FreeListPluginConfigs): PMPluginsFactory =>
  () => {
    return {
      nodes: {
        ...PMP_ORDERED_FREE_LIST_NODE,
        ...PMP_BULLET_FREE_LIST_NODE,
        ...PMP_FREE_LIST_ITEM_NODE,
      },
      marks: {},
      plugins: (schema: Schema) => {
        return createPmpFreeListPlugins({
          orderListNodeType: schema.nodes['ordered_list'],
          bulletListNodeType: schema.nodes['bullet_list'],
          listItemNodeType: schema.nodes['list_item'],
        });
      },
    };
  };

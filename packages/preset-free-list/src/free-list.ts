import { DOMOutputSpec, NodeSpec, Schema } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';

const olDOM: DOMOutputSpec = [
  'ol',
  {
    class: 'pmp-ordered-list',
  },
  0,
];

const ulDOM: DOMOutputSpec = [
  'ul',
  {
    class: 'pmp-bullet-list',
  },
  0,
];

export const orderedList: Record<string, NodeSpec> = {
  ordered_list: {
    attrs: {},
    parseDOM: [
      {
        tag: 'ol',
        getAttrs() {
          return {};
        },
      },
    ],
    toDOM() {
      return olDOM;
    },
  },
};

export const bulletList: Record<string, NodeSpec> = {
  bullet_list: {
    parseDOM: [{ tag: 'ul' }],
    toDOM() {
      return ulDOM;
    },
  },
};

export interface ListItemAttrs {
  indent: number;
}

export const listItem: Record<string, NodeSpec> = {
  list_item: {
    attrs: {
      indent: {
        default: 0,
      },
    },
    parseDOM: [
      {
        tag: 'li',
        getAttrs(node) {
          const dom = node as HTMLElement;
          return {
            indent: dom.getAttribute('data-indent') || 0,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as ListItemAttrs;
      return [
        'li',
        {
          class: `pmp-list-item pmp-list-item-indent-${attrs.indent || 0}`,
          'data-indent': attrs.indent || 0,
        },
        0,
      ];
    },
    defining: true,
  },
};

export interface FreeListPluginConfigs {}

export const FreeList =
  (pluginConfig: FreeListPluginConfigs): PMPluginsFactory =>
  () => {
    return {
      nodes: {
        orderedList,
        bulletList,
        listItem,
      },
      marks: {},
      plugins: (schema: Schema) => {
        return [];
      },
    };
  };

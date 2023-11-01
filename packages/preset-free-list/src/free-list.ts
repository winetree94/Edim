import { DOMOutputSpec, NodeSpec, NodeType, Schema } from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { inputRules } from 'prosemirror-inputrules';
import { wrappingInputRuleWithJoin } from 'prosemirror-preset-utils';
import { keymap } from 'prosemirror-keymap';
import { indentListItem, splitListItem } from './commands';
import { Plugin, PluginKey } from 'prosemirror-state';

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

export const PMP_ORDERED_FREE_LIST_NODE: Record<string, NodeSpec> = {
  ordered_list: {
    parseDOM: [
      {
        tag: 'ol',
        getAttrs() {
          return {};
        },
      },
    ],
    content: 'list_item*',
    group: 'block list',
    toDOM() {
      return olDOM;
    },
  },
};

export const PMP_BULLET_FREE_LIST_NODE: Record<string, NodeSpec> = {
  bullet_list: {
    parseDOM: [{ tag: 'ul' }],
    content: 'list_item*',
    group: 'block list',
    toDOM() {
      return ulDOM;
    },
  },
};

export interface ListItemAttrs {
  indent: number;
}

export const PMP_FREE_LIST_ITEM_NODE: Record<string, NodeSpec> = {
  list_item: {
    content: 'paragraph*',
    group: 'disable-paragraph-attributes',
    attrs: {
      indent: {
        default: 1,
      },
    },
    parseDOM: [
      {
        tag: 'li',
        getAttrs(node) {
          const dom = node as HTMLElement;
          const indent = dom.dataset['indent'];

          let legacyIndent: number = 0;
          for (let i = 1; i <= 4; i++) {
            legacyIndent = dom.classList.contains(`ql-indent-${i}`)
              ? i + 1
              : legacyIndent;
          }

          return {
            indent: legacyIndent || indent || 1,
          };
        },
      },
    ],
    toDOM(node) {
      const attrs = node.attrs as ListItemAttrs;
      return [
        'li',
        {
          class: `pmp-list-item pmp-list-item-indent-${attrs.indent || 1}`,
          'data-indent': attrs.indent || 1,
        },
        0,
      ];
    },
    defining: true,
  },
};

/// Given a list node type, returns an input rule that turns a number
/// followed by a dot at the start of a textblock into an ordered list.
export const orderedListRule = (nodeType: NodeType) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return wrappingInputRuleWithJoin(/^(\d+)\.\s$/, nodeType, {
    indent: 0,
  });
};

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export const bulletListRule = (nodeType: NodeType) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return wrappingInputRuleWithJoin(/^\s*([-+*])\s$/, nodeType, {
    indent: 0,
  });
};

export interface FreeListPluginConfigs { }

export interface createPmpFreeListPluginsConfig {
  orderListNodeType: NodeType;
  bulletListNodeType: NodeType;
  listItemNodeType: NodeType;
}

export const createPmpFreeListPlugins = (
  configs: createPmpFreeListPluginsConfig,
) => {
  return [
    inputRules({
      rules: [
        orderedListRule(configs.orderListNodeType),
        bulletListRule(configs.bulletListNodeType),
      ],
    }),
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

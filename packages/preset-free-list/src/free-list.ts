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

export const orderedList: Record<string, NodeSpec> = {
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
    group: 'block',
    toDOM() {
      return olDOM;
    },
  },
};

export const bulletList: Record<string, NodeSpec> = {
  bullet_list: {
    parseDOM: [{ tag: 'ul' }],
    content: 'list_item*',
    group: 'block',
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
    content: 'paragraph*',
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
  return wrappingInputRuleWithJoin(/^(\d+)\.\s$/, nodeType);
};

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export const bulletListRule = (nodeType: NodeType) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return wrappingInputRuleWithJoin(/^\s*([-+*])\s$/, nodeType);
};

export interface FreeListPluginConfigs {}

export const FreeList =
  (pluginConfig: FreeListPluginConfigs): PMPluginsFactory =>
  () => {
    return {
      nodes: {
        ...orderedList,
        ...bulletList,
        ...listItem,
      },
      marks: {},
      plugins: (schema: Schema) => {
        return [
          inputRules({
            rules: [
              orderedListRule(schema.nodes['ordered_list']),
              bulletListRule(schema.nodes['bullet_list']),
            ],
          }),
          keymap({
            Enter: (state, dispatch) => {
              return splitListItem(schema.nodes['list_item'])(state, dispatch);
            },
            'Shift-Enter': (state, dispatch) => {
              return splitListItem(schema.nodes['list_item'])(state, dispatch);
            },
            Tab: (state, dispatch) => {
              return indentListItem(schema.nodes['list_item'], 1)(
                state,
                dispatch,
              );
            },
            'Shift-Tab': (state, dispatch) => {
              return indentListItem(schema.nodes['list_item'], -1)(
                state,
                dispatch,
              );
            },
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
          // new Plugin({
          //   state: {
          //     init(config, instance) {
          //       return {};
          //     },
          //     apply(tr, value, oldState, newState) {
          //       const { $from, from, $to } = tr.selection;
          //       console.log(from);
          //       // const range = $from.blockRange($to, (node) => {
          //       //   return (
          //       //     node.childCount > 0 &&
          //       //     node.firstChild!.type.name === 'list_item'
          //       //   );
          //       // });
          //       // console.log(range);
          //       return newState;
          //     },
          //   },
          // }),
        ];
      },
    };
  };

import {
  Attrs,
  DOMOutputSpec,
  NodeSpec,
  NodeType,
  Schema,
} from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { EditorState, Transaction } from 'prosemirror-state';
import { liftTarget } from 'prosemirror-transform';

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
    content: 'list_item+',
    group: 'block',
    toDOM() {
      return olDOM;
    },
  },
};

export const bulletList: Record<string, NodeSpec> = {
  bullet_list: {
    parseDOM: [{ tag: 'ul' }],
    content: 'list_item+',
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
    content: 'paragraph block*',
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
          return {
            indent: dom.getAttribute('data-indent') || 1,
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
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs['order'] == +match[1],
  );
};

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export const bulletListRule = (nodeType: NodeType) => {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
};

export const splitListItem = (itemType: NodeType, itemAttrs?: Attrs) => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
  ): boolean => {
    const { $from, $to } = state.tr.selection;

    const parent = $from.node(-1);

    if (parent.type.name !== 'list_item') {
      return false;
    }

    const tr = state.tr.delete($from.pos, $to.pos);

    if (!dispatch) {
      return false;
    }

    const nextType =
      $to.pos == $from.end() ? parent.contentMatchAt(0).defaultType : null;

    const types = nextType
      ? [
          itemAttrs ? { type: itemType, attrs: itemAttrs } : null,
          { type: nextType },
        ]
      : undefined;

    dispatch(tr.split($from.pos, 2, types).scrollIntoView());

    return true;
  };
};

export const indentListItem = (itemType: NodeType, reduce: number) => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
  ): boolean => {
    const { $from, $to } = state.selection;

    const fromGrandParent = $from.node(-2);
    const toGrandParent = $to.node(-2);

    if (fromGrandParent !== toGrandParent) {
      return false;
    }

    let tr = state.tr;

    state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      if (node.type.name !== 'list_item') return;
      const attrs = node.attrs as ListItemAttrs;
      const targetIndent = Math.max(
        0,
        Math.min((attrs.indent || 0) + reduce, 6),
      );
      if (targetIndent <= 0) {
        const resolvedPos = state.doc.resolve(pos + 2);
        const range = resolvedPos.blockRange();
        const target = range && liftTarget(range);
        if (!range || target === null) {
          throw new Error('Cannot lift');
        }
        tr = tr.lift(range, target);
      } else {
        tr = tr.setNodeMarkup(pos, undefined, {
          ...attrs,
          indent: targetIndent,
        });
      }
    });

    if (tr.docChanged) {
      dispatch?.(tr);
      return true;
    }

    return false;
  };
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
            Enter: (state, dispatch, view) => {
              return splitListItem(schema.nodes['list_item'])(state, dispatch);
            },
            'Shift-Enter': (state, dispatch) => {
              return splitListItem(schema.nodes['list_item'])(state, dispatch);
            },
            Tab: (state, dispatch) =>
              indentListItem(schema.nodes['list_item'], 1)(state, dispatch),
            'Shift-Tab': (state, dispatch) =>
              indentListItem(schema.nodes['list_item'], -1)(state, dispatch),
          }),
        ];
      },
    };
  };

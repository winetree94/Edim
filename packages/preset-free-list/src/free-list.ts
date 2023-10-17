import {
  Attrs,
  DOMOutputSpec,
  Fragment,
  Node,
  NodeRange,
  NodeSpec,
  NodeType,
  Schema,
  Slice,
} from 'prosemirror-model';
import { PMPluginsFactory } from 'prosemirror-preset-core';
import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import {
  Command,
  EditorState,
  NodeSelection,
  Selection,
  Transaction,
} from 'prosemirror-state';
import { ReplaceAroundStep, canSplit } from 'prosemirror-transform';

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

          let qlIndent: number = 0;
          for (let i = 1; i <= 4; i++) {
            qlIndent = dom.classList.contains(`ql-indent-${i}`)
              ? i + 1
              : qlIndent;
          }

          return {
            indent: qlIndent || dom.getAttribute('data-indent') || 1,
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

export function liftOutOfList(
  state: EditorState,
  range: NodeRange,
): Transaction | null {
  const tr = state.tr,
    list = range.parent;
  // Merge the list items into a single big item
  for (
    let pos = range.end, i = range.endIndex - 1, e = range.startIndex;
    i > e;
    i--
  ) {
    pos -= list.child(i).nodeSize;
    tr.delete(pos - 1, pos + 1);
  }
  const $start = tr.doc.resolve(range.start),
    item = $start.nodeAfter!;
  if (tr.mapping.map(range.end) != range.start + $start.nodeAfter!.nodeSize)
    return null;
  const atStart = range.startIndex == 0,
    atEnd = range.endIndex == list.childCount;
  const parent = $start.node(-1),
    indexBefore = $start.index(-1);
  if (
    !parent.canReplace(
      indexBefore + (atStart ? 0 : 1),
      indexBefore + 1,
      item.content.append(atEnd ? Fragment.empty : Fragment.from(list)),
    )
  )
    return null;
  const start = $start.pos,
    end = start + item.nodeSize;
  // Strip off the surrounding list. At the sides where we're not at
  // the end of the list, the existing list is closed. At sides where
  // this is the end, it is overwritten to its end.
  return tr.step(
    new ReplaceAroundStep(
      start - (atStart ? 1 : 0),
      end + (atEnd ? 1 : 0),
      start + 1,
      end - 1,
      new Slice(
        (atStart
          ? Fragment.empty
          : Fragment.from(list.copy(Fragment.empty))
        ).append(
          atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty)),
        ),
        atStart ? 0 : 1,
        atEnd ? 0 : 1,
      ),
      atStart ? 0 : 1,
    ),
  );
}

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

    const liftOutNode: {
      node: Node;
      pos: number;
    }[] = [];

    state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      if (node.type.name !== 'list_item') return;
      const attrs = node.attrs as ListItemAttrs;
      const targetIndent = Math.max(
        0,
        Math.min((attrs.indent || 0) + reduce, 6),
      );

      if (targetIndent <= 0) {
        liftOutNode.push({
          node,
          pos,
        });
      } else {
        tr = tr.setNodeMarkup(pos, undefined, {
          ...attrs,
          indent: targetIndent,
        });
      }
    });

    if (liftOutNode.length > 0) {
      const range = $from.blockRange(
        $to,
        (node) => node.childCount > 0 && node.firstChild!.type == itemType,
      );
      if (!range) return false;
      tr = liftOutOfList(state, range) || tr;
    }

    if (tr.docChanged) {
      dispatch?.(tr);
      return true;
    }

    return false;
  };
};

/// Build a command that splits a non-empty textblock at the top level
/// of a list item by also splitting that list item.
export function splitListItem(itemType: NodeType, itemAttrs?: Attrs): Command {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { $from, $to, node } = state.selection as NodeSelection;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to))
      return false;
    const grandParent = $from.node(-1);
    if (grandParent.type != itemType) return false;
    if (
      $from.parent.content.size == 0 &&
      $from.node(-1).childCount == $from.indexAfter(-1)
    ) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if (
        $from.depth == 3 ||
        $from.node(-3).type != itemType ||
        $from.index(-2) != $from.node(-2).childCount - 1
      )
        return false;
      if (dispatch) {
        let wrap = Fragment.empty;
        const depthBefore = $from.index(-1) ? 1 : $from.index(-2) ? 2 : 3;
        // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor
        for (let d = $from.depth - depthBefore; d >= $from.depth - 3; d--)
          wrap = Fragment.from($from.node(d).copy(wrap));
        const depthAfter =
          $from.indexAfter(-1) < $from.node(-2).childCount
            ? 1
            : $from.indexAfter(-2) < $from.node(-3).childCount
            ? 2
            : 3;
        // Add a second list item with an empty default start node
        wrap = wrap.append(Fragment.from(itemType.createAndFill()));
        const start = $from.before($from.depth - (depthBefore - 1));
        const tr = state.tr.replace(
          start,
          $from.after(-depthAfter),
          new Slice(wrap, 4 - depthBefore, 0),
        );
        let sel = -1;
        tr.doc.nodesBetween(start, tr.doc.content.size, (node, pos) => {
          if (sel > -1) return false;
          if (node.isTextblock && node.content.size == 0) sel = pos + 1;
          return false;
        });
        if (sel > -1) tr.setSelection(Selection.near(tr.doc.resolve(sel)));
        dispatch(tr.scrollIntoView());
      }
      return true;
    }
    const nextType =
      $to.pos == $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
    const tr = state.tr.delete($from.pos, $to.pos);
    const types = nextType
      ? [
          itemAttrs ? { type: itemType, attrs: itemAttrs } : null,
          { type: nextType },
        ]
      : undefined;
    if (!canSplit(tr.doc, $from.pos, 2, types)) return false;
    if (dispatch) dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    return true;
  };
}

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

/// Returns a command function that wraps the selection in a list with
/// the given type an attributes. If `dispatch` is null, only return a
/// value to indicate whether this is possible, but don't actually
import { ListItemAttrs } from './free-list';
import {
  Attrs,
  Fragment,
  Node,
  NodeRange,
  NodeType,
  ResolvedPos,
  Slice,
} from 'prosemirror-model';
import {
  Command,
  EditorState,
  NodeSelection,
  Selection,
  Transaction,
} from 'prosemirror-state';
import {
  ReplaceAroundStep,
  canSplit,
  findWrapping,
} from 'prosemirror-transform';

export const doWrapInList = (
  tr: Transaction,
  range: NodeRange,
  wrappers: { type: NodeType; attrs?: Attrs | null }[],
  joinBefore: boolean,
  listType: NodeType,
) => {
  let content = Fragment.empty;
  for (let i = wrappers.length - 1; i >= 0; i--)
    content = Fragment.from(
      wrappers[i].type.create(wrappers[i].attrs, content),
    );

  tr.step(
    new ReplaceAroundStep(
      range.start - (joinBefore ? 2 : 0),
      range.end,
      range.start,
      range.end,
      new Slice(content, 0, 0),
      wrappers.length,
      true,
    ),
  );

  let found = 0;
  for (let i = 0; i < wrappers.length; i++)
    if (wrappers[i].type == listType) found = i + 1;
  const splitDepth = wrappers.length - found;

  let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0);
  const parent = range.parent;
  for (
    let i = range.startIndex, e = range.endIndex, first = true;
    i < e;
    i++, first = false
  ) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }
    splitPos += parent.child(i).nodeSize;
  }
  return tr;
};

export const wrapInFreeList = (
  listType: NodeType,
  attrs: Attrs | null = null,
) => {
  return (
    tr: Transaction,
    $from: ResolvedPos,
    $to: ResolvedPos,
  ): Transaction | null => {
    let range = $from.blockRange($to);
    let doJoin = false;
    let outerRange = range;

    if (!range) return null;
    // This is at the top of an existing list item

    if (
      range.depth >= 2 &&
      $from.node(range.depth - 1).type.compatibleContent(listType) &&
      range.startIndex == 0
    ) {
      // Don't do anything if this is the top of the list
      if ($from.index(range.depth - 1) == 0) return null;
      const $insert = tr.doc.resolve(range.start - 2);
      outerRange = new NodeRange($insert, $insert, range.depth);
      if (range.endIndex < range.parent.childCount)
        range = new NodeRange(
          $from,
          tr.doc.resolve($to.end(range.depth)),
          range.depth,
        );
      doJoin = true;
    }

    const wrap = findWrapping(outerRange!, listType, attrs, range);
    if (!wrap) return null;
    return doWrapInList(tr, range, wrap, doJoin, listType);
  };
};

export const liftOutOfFreeList = (
  tr: Transaction,
  range: NodeRange,
): Transaction | null => {
  const listNode = range.parent;

  // 마지막 li 부터 지우면서 첫번째 li 안으로 모두 병합
  for (
    let pos = range.end, i = range.endIndex - 1, e = range.startIndex;
    i > e;
    i--
  ) {
    pos -= listNode.child(i).nodeSize;
    tr.delete(pos - 1, pos + 1);
  }

  const $rangeStartPos = tr.doc.resolve(range.start);
  const rangeStartItemNode = $rangeStartPos.nodeAfter!;

  if (tr.mapping.map(range.end) != range.start + rangeStartItemNode.nodeSize) {
    return null;
  }

  const atStart = range.startIndex == 0;
  const atEnd = range.endIndex == listNode.childCount;
  const parent = $rangeStartPos.node(-1);
  const indexBefore = $rangeStartPos.index(-1);

  if (
    !parent.canReplace(
      indexBefore + (atStart ? 0 : 1),
      indexBefore + 1,
      rangeStartItemNode.content.append(
        atEnd ? Fragment.empty : Fragment.from(listNode),
      ),
    )
  ) {
    return null;
  }

  const rangeStartItemPos = $rangeStartPos.pos;
  const rangeEndItemPos = rangeStartItemPos + rangeStartItemNode.nodeSize;

  // Strip off the surrounding list. At the sides where we're not at
  // the end of the list, the existing list is closed. At sides where
  // this is the end, it is overwritten to its end.

  const slice = new Slice(
    (atStart
      ? Fragment.empty
      : Fragment.from(listNode.copy(Fragment.empty))
    ).append(
      atEnd ? Fragment.empty : Fragment.from(listNode.copy(Fragment.empty)),
    ),
    atStart ? 0 : 1,
    atEnd ? 0 : 1,
  );

  return tr.step(
    new ReplaceAroundStep(
      rangeStartItemPos - (atStart ? 1 : 0),
      rangeEndItemPos + (atEnd ? 1 : 0),
      rangeStartItemPos + 1,
      rangeEndItemPos - 1,
      slice,
      atStart ? 0 : 1,
    ),
  );
};

export const conversionList = (nodeType: NodeType): Command => {
  return (state, dispatch) => {
    return false;
  };
};

export const toggleList = (nodeType: NodeType): Command => {
  return (state, dispatch) => {
    let tr = state.tr;
    let selection = state.selection;

    const originRange = selection.$from.blockRange(selection.$to, (node) => {
      return ![
        'ordered_list',
        'bullet_list',
        'paragraph',
        'list_item',
        'text',
      ].includes(node.type.name);
    });

    if (!originRange) {
      return false;
    }

    const getRangeNodes = (doc: Node, start: number, to: number) => {
      const rangeNodes: {
        node: Node;
        pos: number;
        start: number;
        end: number;
      }[] = [];

      doc.nodesBetween(start, to, (node, pos, parent) => {
        if (parent !== originRange.parent) {
          return true;
        }
        rangeNodes.push({
          node,
          pos: pos,
          start: Math.max(selection.$from.pos, pos),
          end: Math.min(selection.$to.pos, pos + node.nodeSize),
        });
        return true;
      });

      return rangeNodes;
    };

    const rangeNodes = getRangeNodes(state.doc, selection.from, selection.to);

    // if rangeNodes has no list able item, return false
    if (
      !rangeNodes.every(({ node }) =>
        ['ordered_list', 'bullet_list', 'paragraph'].includes(node.type.name),
      )
    ) {
      return false;
    }

    // if every node already target list, lift out all
    if (rangeNodes.every(({ node }) => node.type === nodeType)) {
      const tr = rangeNodes
        .slice()
        .reverse()
        .reduce((tr, { start, end }) => {
          const range = tr.doc
            .resolve(start)
            .blockRange(tr.doc.resolve(end), (node) => node.type === nodeType);
          return range ? liftOutOfFreeList(tr, range) || tr : tr;
        }, state.tr);
      if (!tr.docChanged) {
        return false;
      }
      dispatch?.(tr);
      return true;
    }

    // lifting
    tr = rangeNodes
      .slice()
      .reverse()
      .filter(({ node }) => node.type.name !== 'paragraph')
      .reduce((tr, { start, end, node }) => {
        const range = tr.doc
          .resolve(start + 1)
          .blockRange(tr.doc.resolve(end - 1), (node) =>
            ['ordered_list', 'bullet_list'].includes(node.type.name),
          );
        if (!range) {
          return tr;
        }
        console.log(node, start, end, range);
        return liftOutOfFreeList(tr, range) || tr;
      }, tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    // wrapping
    tr = wrapInFreeList(nodeType)(tr, selection.$from, selection.$to) || tr;
    selection = state.selection.map(tr.doc, tr.mapping);

    // merge with adjacent list
    const range = selection.$from.blockRange(selection.$to, (node) => {
      return ![
        'ordered_list',
        'bullet_list',
        'paragraph',
        'list_item',
        'text',
      ].includes(node.type.name);
    })!;
    const adjacentsNodes: { node: Node; pos: number }[] = [];
    tr.doc.nodesBetween(range.start - 2, range.end + 2, (node, pos) => {
      if (node.type !== nodeType) {
        return true;
      }
      adjacentsNodes.push({
        node,
        pos,
      });
      return true;
    });
    tr = adjacentsNodes
      .slice()
      .reverse()
      .reduce((tr, { pos }, index, self) => {
        if (index === self.length - 1) {
          return tr;
        }
        return tr.delete(pos - 1, pos + 1);
      }, tr);
    selection = state.selection.map(tr.doc, tr.mapping);

    if (!tr.docChanged) {
      return false;
    }

    dispatch?.(tr.setSelection(selection).scrollIntoView());
    return true;
  };
};

export const indentListItem = (itemType: NodeType, reduce: number): Command => {
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
      tr = liftOutOfFreeList(state.tr, range) || tr;
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
export const splitListItem = (
  itemType: NodeType,
  itemAttrs?: Attrs,
): Command => {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { $from, $to, node } = state.selection as NodeSelection;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }

    const grandParent = $from.node(-1);
    if (grandParent.type != itemType) {
      return false;
    }

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
};

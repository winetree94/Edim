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
    const { $from, $to } = state.tr.selection;
    const whiteList = ['doc', 'table_cell'];
    const originRange = $from.blockRange($to, (node) => {
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

    if (!whiteList.includes(originRange.parent.type.name)) {
      return false;
    }

    const rangeNodes: {
      node: Node;
      pos: number;
    }[] = [];

    state.doc.nodesBetween(
      originRange.start,
      originRange.end,
      (node, pos, parent) => {
        if (parent !== originRange.parent) {
          return true;
        }
        rangeNodes.push({
          node,
          // pos: pos,
          pos: Math.min(Math.max(pos, originRange.start), originRange.end),
        });
        return true;
      },
    );

    // if every node already target list, lift out all
    if (rangeNodes.every(({ node }) => node.type === nodeType)) {
      console.log(rangeNodes);
      const tr = rangeNodes
        .slice()
        .reverse()
        .reduce((tr, { node, pos }) => {
          const start = tr.doc.resolve(pos + 1);
          const end = tr.doc.resolve(pos + node.nodeSize - 1);
          const range = start.blockRange(end);
          return range ? liftOutOfFreeList(tr, range) || tr : tr;
        }, state.tr);
      if (!tr.docChanged) {
        return false;
      }
      dispatch?.(tr);
      return true;
    }

    const groups = rangeNodes
      .reduce<{ node: Node; pos: number }[][]>((result, { node, pos }) => {
        const previousGroup = result[result.length - 1];
        if (
          previousGroup &&
          previousGroup[0] &&
          previousGroup[0]?.node.type.name === node.type.name
        ) {
          previousGroup.push({ node, pos });
        } else {
          result.push([{ node, pos }]);
        }
        return result;
      }, [])
      .reverse()
      .filter((group) => group.length > 0);

    tr = groups.reduce<Transaction>((tr, group) => {
      const type = group[0].node.type.name;
      if (type === 'paragraph') {
        return (
          wrapInFreeList(nodeType)(
            tr,
            state.doc.resolve(group[0].pos),
            state.doc.resolve(
              group[group.length - 1].pos +
                group[group.length - 1].node.nodeSize,
            ),
          ) || tr
        );
      } else {
        return group.reduce<Transaction>((tr, { node, pos }) => {
          return tr.setNodeMarkup(pos, nodeType, {
            ...node.attrs,
            type: nodeType.name,
          });
        }, tr);
      }
    }, tr);

    const prevSelection = state.selection;
    const mappedSelection = prevSelection.map(tr.doc, tr.mapping);

    const listNodePositions: number[] = [];

    tr.doc.nodesBetween(
      mappedSelection.from,
      mappedSelection.to,
      (node, pos) => {
        if (node.type === nodeType) {
          listNodePositions.push(pos);
        }
        return true;
      },
    );

    // merge all converted list
    tr = listNodePositions
      .slice()
      .reverse()
      .reduce((tr, pos, index, self) => {
        if (index === self.length - 1) {
          return tr;
        }
        return tr.delete(pos - 1, pos + 1);
      }, tr);

    if (!tr.docChanged) {
      return false;
    }

    dispatch?.(
      tr.setSelection(prevSelection.map(tr.doc, tr.mapping)).scrollIntoView(),
    );
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

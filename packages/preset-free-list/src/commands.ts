/// Returns a command function that wraps the selection in a list with
/// the given type an attributes. If `dispatch` is null, only return a
/// value to indicate whether this is possible, but don't actually
import { joinBackward } from 'prosemirror-commands';
import {
  Attrs,
  Fragment,
  Node,
  NodeRange,
  NodeType,
  ResolvedPos,
  Slice,
} from 'prosemirror-model';
import { lift } from 'prosemirror-preset-utils';
import { Command, EditorState, Transaction } from 'prosemirror-state';
import {
  ReplaceAroundStep,
  canSplit,
  findWrapping,
} from 'prosemirror-transform';

export function doWrapInList(
  tr: Transaction,
  range: NodeRange,
  wrappers: { type: NodeType; attrs?: Attrs | null }[],
  joinBefore: boolean,
  listType: NodeType,
) {
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
}

/// perform the change.
export function wrapInFreeList(
  listType: NodeType,
  attrs: Attrs | null = null,
): Command {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { $from, $to } = state.selection;
    let range = $from.blockRange($to);
    let doJoin = false;
    let outerRange = range;

    if (!range) return false;
    // This is at the top of an existing list item

    if (
      range.depth >= 2 &&
      $from.node(range.depth - 1).type.compatibleContent(listType) &&
      range.startIndex == 0
    ) {
      // Don't do anything if this is the top of the list
      if ($from.index(range.depth - 1) == 0) return false;
      const $insert = state.doc.resolve(range.start - 2);
      outerRange = new NodeRange($insert, $insert, range.depth);
      if (range.endIndex < range.parent.childCount)
        range = new NodeRange(
          $from,
          state.doc.resolve($to.end(range.depth)),
          range.depth,
        );
      doJoin = true;
    }

    const wrap = findWrapping(outerRange!, listType, attrs, range);
    if (!wrap) return false;
    if (dispatch) {
      dispatch(
        doWrapInList(state.tr, range, wrap, doJoin, listType).scrollIntoView(),
      );
    }
    return true;
  };
}

export function wrapInFreeList3(
  listType: NodeType,
  attrs: Attrs | null = null,
) {
  return function (
    tr: Transaction,
    $from: ResolvedPos,
    $to: ResolvedPos,
  ): Transaction | null {
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
}

export const liftOutOfList = (
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

  // console.log(
  //   rangeStartItemPos - (atStart ? 1 : 0),
  //   rangeEndItemPos + (atEnd ? 1 : 0),
  //   rangeStartItemPos + 1,
  //   rangeEndItemPos - 1,
  //   slice,
  //   atStart ? 0 : 1,
  // );

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

export const toggleList = (
  nodeType: NodeType,
  attrs: Attrs | null = null,
): Command => {
  return (state, dispatch) => {
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
          pos: pos,
        });
        return true;
      },
    );

    // if every node already target list, lift out all
    if (rangeNodes.every(({ node }) => node.type === nodeType)) {
      const tr = rangeNodes
        .slice()
        .reverse()
        .reduce((tr, { node, pos }) => {
          const start = tr.doc.resolve(pos + 1);
          const end = tr.doc.resolve(pos + node.nodeSize - 1);
          const range = new NodeRange(start, end, start.depth);
          return liftOutOfList(tr, range) || tr;
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

    let tr = state.tr;
    groups.forEach((group) => {
      const type = group[0].node.type.name;
      switch (type) {
        case 'paragraph':
          tr =
            wrapInFreeList3(nodeType)(
              tr,
              state.doc.resolve(group[0].pos),
              state.doc.resolve(
                group[group.length - 1].pos +
                  group[group.length - 1].node.nodeSize,
              ),
            ) || tr;
          break;
        default:
          group.forEach(({ node, pos }) => {
            tr = tr.setNodeMarkup(pos, nodeType, {
              ...node.attrs,
              type: nodeType.name,
            });
          });
          break;
      }
    });

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

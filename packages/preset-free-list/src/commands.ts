/// Returns a command function that wraps the selection in a list with
/// the given type an attributes. If `dispatch` is null, only return a
/// value to indicate whether this is possible, but don't actually

import { wrapIn } from 'prosemirror-commands';
import {
  Attrs,
  Fragment,
  NodeRange,
  NodeType,
  ResolvedPos,
  Slice,
} from 'prosemirror-model';
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

/// perform the change.
export function wrapInFreeList2(
  listType: NodeType,
  attrs: Attrs | null = null,
): Command {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { $from, $to } = state.selection;

    const range = $from.blockRange($to);
    if (!range) return false;
    console.log(range.parent);

    const tr = state.tr;
    // range.parent.forEach((child, offset, index) => {
    //   wrapIn(listType, attrs)(state, dispatch);
    // });

    if (dispatch) {
      dispatch(tr.scrollIntoView());
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

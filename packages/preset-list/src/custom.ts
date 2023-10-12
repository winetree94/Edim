import { Attrs, Fragment, NodeRange, NodeType, Slice } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import {
  ReplaceAroundStep,
  canSplit,
  findWrapping,
} from 'prosemirror-transform';

export const doWrapInList2 = (
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

export const wrapInList2 = (
  state: EditorState,
  tr: Transaction,
  listType: NodeType,
  attrs: Attrs | null = null,
): Transaction => {
  const { $from, $to } = state.selection;
  let range = $from.blockRange($to),
    doJoin = false,
    outerRange = range;
  if (!range) {
    throw new Error('Connot wrapInList');
  }
  // This is at the top of an existing list item
  if (
    range.depth >= 2 &&
    $from.node(range.depth - 1).type.compatibleContent(listType) &&
    range.startIndex == 0
  ) {
    // Don't do anything if this is the top of the list
    if ($from.index(range.depth - 1) == 0) {
      throw new Error('Connot wrapInList');
    }
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
  if (!wrap) {
    throw new Error('Connot wrapInList');
  }
  return doWrapInList2(tr, range, wrap, doJoin, listType);
};

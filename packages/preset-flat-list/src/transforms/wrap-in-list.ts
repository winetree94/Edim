import { Transaction } from 'prosemirror-state';
import {
  Attrs,
  Fragment,
  NodeRange,
  NodeType,
  ResolvedPos,
  Slice,
} from 'prosemirror-model';
import {
  canSplit,
  findWrapping,
  ReplaceAroundStep,
} from 'prosemirror-transform';

export const doWrapInFlatList = (
  tr: Transaction,
  range: NodeRange,
  wrappers: {
    type: NodeType;
    attrs?: Attrs | null;
  }[],
  joinBefore: boolean,
  listType: NodeType,
): Transaction => {
  let content = Fragment.empty;
  for (let i = wrappers.length - 1; i >= 0; i--) {
    content = Fragment.from(
      wrappers[i].type.create(wrappers[i].attrs, content),
    );
  }

  // 재배치 하는 것
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
  for (let i = 0; i < wrappers.length; i++) {
    if (wrappers[i].type == listType) {
      found = i + 1;
    }
  }
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

// list를 감싸는 것
export const wrapInFlatList =
  (listType: NodeType, attrs: Attrs | null = null) =>
  (
    tr: Transaction,
    $from: ResolvedPos,
    $to: ResolvedPos,
  ): Transaction | null => {
    let range = $from.blockRange($to);
    let doJoin = false;
    let outerRange = range;

    if (!range) {
      return null;
    }
    // This is at the top of an existing list item

    if (
      range.depth >= 2 &&
      $from.node(range.depth - 1).type.compatibleContent(listType) &&
      range.startIndex == 0
    ) {
      // Don't do anything if this is the top of the list
      if ($from.index(range.depth - 1) == 0) {
        return null;
      }
      const $insert = tr.doc.resolve(range.start - 2);
      outerRange = new NodeRange($insert, $insert, range.depth);
      if (range.endIndex < range.parent.childCount) {
        range = new NodeRange(
          $from,
          tr.doc.resolve($to.end(range.depth)),
          range.depth,
        );
      }
      doJoin = true;
    }

    const wrap = findWrapping(outerRange!, listType, attrs, range);
    if (!wrap) {
      return null;
    }
    return doWrapInFlatList(tr, range, wrap, doJoin, listType);
  };

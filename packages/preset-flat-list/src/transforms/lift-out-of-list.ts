import { Fragment, NodeRange, Slice } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { ReplaceAroundStep } from 'prosemirror-transform';

export const liftOutOfFlatList = (
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

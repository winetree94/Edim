import { MarkType, Node } from 'prosemirror-model';
import { SelectionRange } from 'prosemirror-state';

export const markApplies = (
  doc: Node,
  ranges: readonly SelectionRange[],
  type: MarkType,
) => {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    let can =
      $from.depth == 0
        ? doc.inlineContent && doc.type.allowsMarkType(type)
        : false;
    doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (can) {
        return false;
      }
      can = node.inlineContent && node.type.allowsMarkType(type);
      return undefined;
    });
    if (can) {
      return true;
    }
  }
  return false;
};

import { InputRule } from 'prosemirror-inputrules';
import { Attrs, Node, NodeType } from 'prosemirror-model';
import { canJoin, findWrapping } from 'prosemirror-transform';

export function wrappingInputRuleWithJoin(
  regexp: RegExp,
  nodeType: NodeType,
  getAttrs: Attrs | null | ((matches: RegExpMatchArray) => Attrs | null) = null,
  beforeJoinPredicate?: (match: RegExpMatchArray, node: Node) => boolean,
  afterJoinPredicate?: (match: RegExpMatchArray, node: Node) => boolean,
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const tr = state.tr.delete(start, end);
    const $start = tr.doc.resolve(start);
    const range = $start.blockRange();
    const wrapping = range && findWrapping(range, nodeType, attrs);

    if (!wrapping) {
      return null;
    }

    tr.wrap(range, wrapping);

    const beforePos = start - 1;
    const before = tr.doc.resolve(beforePos).nodeBefore;

    if (
      before &&
      before.type == nodeType &&
      canJoin(tr.doc, beforePos) &&
      (!beforeJoinPredicate || beforeJoinPredicate(match, before))
    ) {
      tr.join(beforePos);
    }

    const afterNode = tr.doc.resolve(start).nodeAfter;

    if (!afterNode) {
      return tr;
    }

    const afterPos = start + afterNode.nodeSize + 1;
    const after = tr.doc.resolve(afterPos).nodeBefore;

    if (
      after &&
      after.type == nodeType &&
      canJoin(tr.doc, afterPos) &&
      (!afterJoinPredicate || afterJoinPredicate(match, after))
    ) {
      tr.join(afterPos);
    }

    return tr;
  });
}

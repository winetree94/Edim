import { InputRule } from 'prosemirror-inputrules';
import { Attrs, Node, NodeType } from 'prosemirror-model';
import { canJoin, findWrapping } from 'prosemirror-transform';

export const wrappingInputRuleWithJoin = (
  regexp: RegExp,
  nodeType: NodeType,
  getNodeAttrs:
    | Attrs
    | null
    | ((matches: RegExpMatchArray) => Attrs | null) = null,
  getWrapperAttrs:
    | Attrs
    | null
    | ((matches: RegExpMatchArray) => Attrs | null) = null,
  beforeJoinPredicate?: (match: RegExpMatchArray, node: Node) => boolean,
  afterJoinPredicate?: (match: RegExpMatchArray, node: Node) => boolean,
) => {
  return new InputRule(regexp, (state, match, start, end) => {
    const nodeAttrs =
      getNodeAttrs instanceof Function ? getNodeAttrs(match) : getNodeAttrs;
    const wrapperAttrs =
      getWrapperAttrs instanceof Function
        ? getWrapperAttrs(match)
        : getWrapperAttrs;
    let tr = state.tr.delete(start, end);
    const $start = tr.doc.resolve(start);
    const range = $start.blockRange();
    const wrapping = range && findWrapping(range, nodeType, wrapperAttrs);

    if (!wrapping) {
      return null;
    }

    if (nodeAttrs) {
      tr = tr.setNodeMarkup(start - 1, undefined, nodeAttrs);
    }
    tr = tr.wrap(range, wrapping);

    const beforePos = start - 1;
    const before = tr.doc.resolve(beforePos).nodeBefore;
    const beforeCanJoin =
      before &&
      before.type == nodeType &&
      canJoin(tr.doc, beforePos) &&
      (!beforeJoinPredicate || beforeJoinPredicate(match, before));

    if (beforeCanJoin) {
      tr = tr.join(beforePos);
    }

    const afterNode = tr.doc.resolve(start + 1).nodeBefore;

    if (!afterNode) {
      return tr;
    }

    const afterPos = start + afterNode.nodeSize + 1;
    const after = tr.doc.resolve(afterPos).nodeBefore;
    const afterCanJoin =
      after &&
      after.type == nodeType &&
      canJoin(tr.doc, afterPos) &&
      (!afterJoinPredicate || afterJoinPredicate(match, after));

    if (afterCanJoin) {
      tr = tr.join(afterPos);
    }

    const $beforeMergedNodePos =
      beforeCanJoin &&
      tr.doc
        .resolve(beforePos)
        .blockRange(undefined, (node) => node.type === nodeType);

    if (!$beforeMergedNodePos) {
      return tr;
    }

    if (tr.doc.nodeSize <= $beforeMergedNodePos.end + 3) {
      return tr;
    }

    const nextNode = tr.doc
      .resolve($beforeMergedNodePos.end + 3)
      .blockRange(undefined, (node) => node.type === nodeType);

    if (!nextNode) {
      return tr;
    }

    tr = tr.delete($beforeMergedNodePos.end, nextNode.start);

    return tr;
  });
};

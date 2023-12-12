import { InputRule } from 'prosemirror-inputrules';
import { Attrs, Node } from 'prosemirror-model';
import { canJoin, findWrapping } from 'prosemirror-transform';
import { NodeTypeOrGetter } from '../types';
import { parseNodeType } from '../utils';

/// Build an input rule for automatically wrapping a textblock when a
/// given string is typed. The `regexp` argument is
/// directly passed through to the `InputRule` constructor. You'll
/// probably want the regexp to start with `^`, so that the pattern can
/// only occur at the start of a textblock.
///
/// `nodeType` is the type of node to wrap in. If it needs attributes,
/// you can either pass them directly, or pass a function that will
/// compute them from the regular expression match.
///
/// By default, if there's a node with the same type above the newly
/// wrapped node, the rule will try to [join](#transform.Transform.join) those
/// two nodes. You can pass a join predicate, which takes a regular
/// expression match and the node before the wrapped node, and can
/// return a boolean to indicate whether a join should happen.
export function wrappingInputRule(
  regexp: RegExp,
  nodeType: NodeTypeOrGetter,
  getAttrs: Attrs | null | ((matches: RegExpMatchArray) => Attrs | null) = null,
  joinPredicate?: (match: RegExpMatchArray, node: Node) => boolean,
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const tr = state.tr.delete(start, end);
    const $start = tr.doc.resolve(start);
    const range = $start.blockRange();
    const wrapping =
      range && findWrapping(range, parseNodeType(nodeType, state), attrs);
    if (!wrapping) {
      return null;
    }
    tr.wrap(range, wrapping);
    const before = tr.doc.resolve(start - 1).nodeBefore;
    if (
      before &&
      before.type == nodeType &&
      canJoin(tr.doc, start - 1) &&
      (!joinPredicate || joinPredicate(match, before))
    ) {
      tr.join(start - 1);
    }
    return tr;
  });
}

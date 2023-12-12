/// Build an input rule that changes the type of a textblock when the
/// matched text is typed into it. You'll usually want to start your
/// regexp with `^` to that it is only matched at the start of a
/// textblock. The optional `getAttrs` parameter can be used to compute
/// the new node's attributes, and works the same as in the

import { InputRule } from 'prosemirror-inputrules';
import { Attrs } from 'prosemirror-model';
import { NodeTypeOrGetter } from '../types';
import { parseNodeType } from '../utils';

/// `wrappingInputRule` function.
export function textblockTypeInputRule(
  regexp: RegExp,
  maybeNodeType: NodeTypeOrGetter,
  getAttrs: Attrs | null | ((match: RegExpMatchArray) => Attrs | null) = null,
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const nodeType = parseNodeType(maybeNodeType, state);
    const $start = state.doc.resolve(start);
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    if (
      !$start
        .node(-1)
        .canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)
    ) {
      return null;
    }
    return state.tr
      .delete(start, end)
      .setBlockType(start, start, nodeType, attrs);
  });
}

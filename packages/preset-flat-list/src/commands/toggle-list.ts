import { Fragment, NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { liftOut } from '../transforms';
import { getBlockContainerChildren } from 'prosemirror-preset-core';

const allowedContentTypes = [
  'paragraph',
  'heading',
  'code_block',
  'blockquote',
  'ordered_list',
  'bullet_list',
];

export const toggleList =
  (nodeType: NodeType): Command =>
  (state, dispatch) => {
    const listItemType = state.schema.nodes['list_item'];
    let tr = state.tr;
    let selection = state.selection;

    const nodes = getBlockContainerChildren(
      tr.doc,
      selection.from,
      selection.to,
    ).filter(({ node }) => allowedContentTypes.includes(node.type.name));

    if (nodes.every(({ node }) => node.type === nodeType)) {
      tr = liftOut(tr, state, selection.from, selection.to).tr;
      selection = state.selection.map(tr.doc, tr.mapping);
      dispatch?.(tr.setSelection(selection));
      return true;
    }

    const liftOutResult = liftOut(tr, state, selection.from, selection.to);
    const indents = liftOutResult.indents.reverse();
    tr = liftOutResult.tr;
    selection = state.selection.map(tr.doc, tr.mapping);

    tr = getBlockContainerChildren(tr.doc, selection.from, selection.to)
      .slice()
      .reverse()
      .reduce((tr, { node, pos }, index) => {
        const $from = tr.doc.resolve(pos);
        const $to = tr.doc.resolve(pos + node.nodeSize);
        const range = $from.blockRange($to)!;
        if (!listItemType.validContent(Fragment.from(node))) {
          return tr;
        }
        tr = tr.wrap(range, [
          {
            type: nodeType,
            attrs: null,
          },
          {
            type: listItemType,
            attrs: { indent: indents[index] },
          },
        ]);
        return tr;
      }, tr);

    selection = state.selection.map(tr.doc, tr.mapping);
    dispatch?.(tr.setSelection(selection));
    return true;
  };

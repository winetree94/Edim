import { NodeType } from 'prosemirror-model';
import { NodePair } from 'prosemirror-preset-utils';
import { Command } from 'prosemirror-state';

export const setToParagraph =
  (nodeType: NodeType): Command =>
  (state, dispatch) => {
    const selection = state.selection;
    let tr = state.tr;

    const nodes: NodePair[] = [];
    state.doc.nodesBetween(
      selection.from,
      selection.to,
      (node, pos, parent) => {
        if (parent?.type.spec.group?.includes('block-container')) {
          nodes.push({ node, pos, parent });
          return false;
        }
        return true;
      },
    );

    tr = nodes
      .slice()
      .reverse()
      .reduce((tr, { node, pos, parent }) => {
        if (node.type === nodeType) {
          return tr;
        } else if (nodeType.validContent(node.content)) {
          tr = tr.setNodeMarkup(pos, nodeType, node.attrs, node.marks);
        }
        return tr;
      }, tr);

    if (tr.docChanged) {
      dispatch?.(tr);
    }

    return true;
  };

import { Node } from 'prosemirror-model';
import { Command, EditorState, Transaction } from 'prosemirror-state';
import { liftOutOfFlatList } from '../transforms';
import { NodeTypeOrGetter, parseNodeType } from '@edim-editor/core';

export interface IndentListItemCommandConfigs {
  listNodeTypes: NodeTypeOrGetter[];
  listItemNodeType: NodeTypeOrGetter;
  reduce: number;
}

export const indentListItem = (
  configs: IndentListItemCommandConfigs,
): Command => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
  ): boolean => {
    const listNodeTypes = configs.listNodeTypes.map((maybeType) =>
      parseNodeType(maybeType, state),
    );
    const listItemNodeType = parseNodeType(configs.listItemNodeType, state);

    let tr = state.tr;
    let selection = state.selection;
    const { $from, $to } = selection;

    const indentableNodes: {
      node: Node;
      pos: number;
      parent: Node | null;
    }[] = [];

    state.tr.doc.nodesBetween($from.pos, $to.pos, (node, pos, parent) => {
      if (node.type.spec.attrs?.['indent']) {
        indentableNodes.push({
          node,
          pos: pos,
          parent: parent,
        });
        return false;
      }
      return true;
    });

    tr = indentableNodes
      .slice()
      .reverse()
      .reduce<Transaction>((tr, { node, pos }) => {
        const attrs = node.attrs as { indent: number };
        const originIndent = attrs.indent;
        const expectedIndent = Math.min(
          (originIndent || 0) + configs.reduce,
          6,
        );

        if (node.type !== listItemNodeType) {
          const targetIndent = Math.max(expectedIndent, 0);
          if (targetIndent === originIndent) {
            return tr;
          }
          return tr.setNodeMarkup(tr.mapping.map(pos), node.type, {
            indent: targetIndent,
          });
        }

        if (expectedIndent <= 0) {
          const range = tr.doc
            .resolve(pos)
            .blockRange(tr.doc.resolve(pos + node.nodeSize), (node) => {
              return listNodeTypes.includes(node.type);
            });
          return liftOutOfFlatList(tr, range!)!;
        }

        if (originIndent === expectedIndent) {
          return tr;
        }
        return tr.setNodeMarkup(pos, node.type, {
          indent: expectedIndent,
        });
      }, tr);

    if (!tr.docChanged) {
      return false;
    }

    selection = state.selection.map(tr.doc, tr.mapping);
    dispatch?.(tr);

    return true;
  };
};

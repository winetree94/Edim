import { Fragment, Node } from 'prosemirror-model';
import { Command, EditorState, TextSelection, Transaction } from 'prosemirror-state';

/**
 * Deletes the table around the selection, if any.
 *
 * @public
 */
export function deleteTable(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
): boolean {
  const $pos = state.selection.$anchor;
  for (let d = $pos.depth; d > 0; d--) {
    const node = $pos.node(d);
    if (node.type.spec['tableRole'] == 'table') {
      if (dispatch)
        dispatch(
          state.tr.delete($pos.before(d), $pos.after(d)).scrollIntoView(),
        );
      return true;
    }
  }
  return false;
}

export const insertTable = (): Command => {
  return (state, dispatch) => {
    const offset: number = state.tr.selection.anchor + 1;
    const transaction = state.tr;
    const cell: Node = state.schema.nodes[
      'table_cell'
    ].createAndFill() as unknown as Node;

    const node: Node = state.schema.nodes['table'].create(
      null,
      Fragment.fromArray([
        state.schema.nodes['table_row'].create(
          null,
          Fragment.fromArray([cell, cell, cell]),
        ),
        state.schema.nodes['table_row'].create(
          null,
          Fragment.fromArray([cell, cell, cell]),
        ),
      ]),
    ) as unknown as Node;

    dispatch?.(
      transaction
        .replaceSelectionWith(node)
        .scrollIntoView()
        .setSelection(TextSelection.near(transaction.doc.resolve(offset))),
    );

    return false;
  }
}
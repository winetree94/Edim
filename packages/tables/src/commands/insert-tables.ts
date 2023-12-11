import { Fragment, Node } from 'prosemirror-model';
import { Command, TextSelection } from 'prosemirror-state';

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
  };
};

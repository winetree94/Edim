import { columnResizing, tableEditing } from 'prosemirror-tables';
import { createPmpTableCellButtonPlugins } from './cell-button';
import { createPmpFocusedCellDecorationPlugins } from './focused-cell';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { PmpTableNodeView } from '../node-views';

export const createPmpTableEditingPlugins = () => {
  return [
    ...createPmpFocusedCellDecorationPlugins(),
    ...createPmpTableCellButtonPlugins(),
    new PMPlugin({
      props: {
        nodeViews: {
          table: (node, view, getPos) =>
            new PmpTableNodeView(node, view, getPos),
        },
      },
    }),
    columnResizing(),
    tableEditing(),
  ];
};

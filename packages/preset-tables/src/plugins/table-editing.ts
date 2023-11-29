import { columnResizing, tableEditing } from 'prosemirror-tables';
import { createPmpFocusedCellDecorationPlugins } from './focused-cell';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { PmpTableNodeView } from '../node-views';

export const createPmpTableEditingPlugins = () => {
  return [
    ...createPmpFocusedCellDecorationPlugins(),
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

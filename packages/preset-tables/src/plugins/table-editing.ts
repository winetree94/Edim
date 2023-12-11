import { columnResizing, tableEditing } from 'prosemirror-tables';
import { createEdimTableCellButtonPlugins } from './cell-button';
import { createEdimFocusedCellDecorationPlugins } from './focused-cell';
import { Plugin as EDIMlugin } from 'prosemirror-state';
import { EdimTableNodeView } from '../node-views';

export const createEdimTableEditingPlugins = () => {
  return [
    ...createEdimFocusedCellDecorationPlugins(),
    ...createEdimTableCellButtonPlugins(),
    new EDIMlugin({
      props: {
        nodeViews: {
          table: (node, view, getPos) =>
            new EdimTableNodeView(node, view, getPos),
        },
      },
    }),
    columnResizing(),
    tableEditing(),
  ];
};

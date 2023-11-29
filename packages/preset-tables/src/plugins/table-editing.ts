import { columnResizing, tableEditing } from 'prosemirror-tables';
import { createPmpFocusedCellDecorationPlugins } from './focused-cell';
import { Plugin as PMPlugin } from 'prosemirror-state';

export const createPmpTableEditingPlugins = () => {
  return [
    ...createPmpFocusedCellDecorationPlugins(),
    columnResizing(),
    tableEditing(),
    new PMPlugin({
    
    })
  ];
}
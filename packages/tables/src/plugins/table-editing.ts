import { columnResizing, tableEditing } from 'prosemirror-tables';
import { edimTableCellButtonPlugins } from './cell-button';
import { edimFocusedCellDecorationPlugins } from './focused-cell';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { EdimTableNodeView } from '../node-views';
import { NodeType } from 'prosemirror-model';

export interface EdimTableEditingPluginConfigs {
  tableNodeType: NodeType;
  tableRowNodeType: NodeType;
  tableCellNodeType: NodeType;
}

export const edimTableEditingPlugins = (
  configs: EdimTableEditingPluginConfigs,
) => {
  const plugins: PMPlugin[] = [
    ...edimFocusedCellDecorationPlugins(),
    ...edimTableCellButtonPlugins(),
    new PMPlugin({
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
  return plugins;
};

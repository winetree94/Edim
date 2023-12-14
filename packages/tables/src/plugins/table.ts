import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';

export interface EdimTablePluginConfigs {
  tableNodeType: NodeType;
  tableRowNodeType: NodeType;
  tableCellNodeType: NodeType;
}

export const edimTablePlugins = (configs: EdimTablePluginConfigs) => {
  return [new PMPlugin({})];
};

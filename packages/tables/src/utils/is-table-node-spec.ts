import { NodeSpec } from 'prosemirror-model';
import { TableNodeSpec } from '../schemas';

export const isTableNodeSpec = (
  nodeSpec: NodeSpec,
): nodeSpec is TableNodeSpec => {
  return nodeSpec['tableRole'] !== undefined;
};

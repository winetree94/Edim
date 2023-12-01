import { NodePair } from '../types';
import { Node } from 'prosemirror-model';

export const getBlockContainerChildren = (
  doc: Node,
  from: number,
  to: number,
) => {
  const nodes: NodePair[] = [];
  doc.nodesBetween(from, to, (node, pos, parent) => {
    if (
      parent?.type.spec.group?.includes('block-container') &&
      node.type.name !== 'table'
    ) {
      nodes.push({ node, pos, parent });
      return false;
    }
    return true;
  });
  return nodes;
};

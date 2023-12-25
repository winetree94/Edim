import { Selection } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';

const findBlockContainer = findParentNode(
  (node) => !!node.type.spec.group?.includes('block-container'),
);

export const findNearestBlockContainer = (selection: Selection) =>
  findBlockContainer(selection);

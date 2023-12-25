import { Selection } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';

const findBlockContainer = findParentNode((node) => {
  return node.isBlock && !node.inlineContent;
});

export const findNearestBlockContainer = (selection: Selection) =>
  findBlockContainer(selection);

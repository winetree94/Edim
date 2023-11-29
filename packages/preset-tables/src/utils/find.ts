import { Rect, TableMap } from 'prosemirror-tables';
import { findParentNode, findParentNodeClosestToPos } from 'prosemirror-utils';
import { Selection } from 'prosemirror-state';
import { Node, ResolvedPos } from 'prosemirror-model';
import { isTableNodeSpec } from './is-table-node-spec';

export const findTable = (selection: Selection) =>
  findParentNode(
    (node) =>
      isTableNodeSpec(node.type.spec) &&
      node.type.spec['tableRole'] === 'table',
  )(selection);

export const findTableClosestToPos = ($pos: ResolvedPos) => {
  const predicate = (node: Node) =>
    isTableNodeSpec(node.type.spec) && node.type.spec['tableRole'] === 'table';
  return findParentNodeClosestToPos($pos, predicate);
};

export const findCellClosestToPos = ($pos: ResolvedPos) => {
  const predicate = (node: Node) =>
    isTableNodeSpec(node.type.spec) &&
    /cell/i.test(node.type.spec['tableRole']);
  return findParentNodeClosestToPos($pos, predicate);
};

export const findCellRectClosestToPos = ($pos: ResolvedPos): Rect | void => {
  const cell = findCellClosestToPos($pos);
  if (cell) {
    const table = findTableClosestToPos($pos);
    if (table) {
      const map = TableMap.get(table.node);
      const cellPos = cell.pos - table.start;
      return map.rectBetween(cellPos, cellPos);
    }
  }
};

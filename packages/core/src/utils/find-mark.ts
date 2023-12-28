import { EditorState } from 'prosemirror-state';
import { Mark, MarkType, Node } from 'prosemirror-model';
import { findParentNode } from 'prosemirror-utils';
import { rangeBetween } from '../utils';

export interface FindMarkConfigs {
  includeAdjacent?: boolean;
}

export interface FindMarkResult {
  node: Node;
  pos: number;
  mark: Mark;
  parent: Node | null;
}

const DEFAULT_CONFIGS: Readonly<FindMarkConfigs> = {
  includeAdjacent: false,
};

export const findMark = (markType: MarkType, configs?: FindMarkConfigs) => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  return (state: EditorState): FindMarkResult | null => {
    const parent = findParentNode(() => true)(state.selection);

    if (!parent) {
      return null;
    }

    const parentPos = parent.pos;

    const start = Math.max(
      Math.min(
        state.selection.from -
          parent.pos -
          (mergedConfigs.includeAdjacent ? 2 : 1),
        parent.node.content.size,
      ),
      0,
    );

    const end = Math.min(
      Math.min(
        state.selection.to -
          parent.pos -
          (mergedConfigs.includeAdjacent ? 0 : 1),
        parent.node.content.size,
      ),
      parent.node.content.size,
    );

    let findResult: FindMarkResult | null = null;
    parent.node.nodesBetween(start, end, (node, pos, parent) => {
      if (findResult !== null) {
        return false;
      }
      const mark = node.marks.find((mark) => mark.type === markType);
      if (!mark) {
        return true;
      }

      const actualPos = pos + parentPos + 1;
      if (
        !rangeBetween(actualPos, actualPos + node.nodeSize)(
          state.selection.from,
          state.selection.to,
        )
      ) {
        return true;
      }

      findResult = {
        node,
        pos: actualPos,
        parent,
        mark,
      };
      return false;
    });

    if (findResult === null) {
      return null;
    }

    return findResult;
  };
};

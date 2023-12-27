import { EditorState } from 'prosemirror-state';
import { MarkType } from 'prosemirror-model';
import { findParentNode } from 'prosemirror-utils';
import { NodePair } from '../types';

export interface FindMarkConfigs {
  includeAdjacent?: boolean;
}

const DEFAULT_CONFIGS: Readonly<FindMarkConfigs> = {
  includeAdjacent: false,
};

export const findMark = (markType: MarkType, configs?: FindMarkConfigs) => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };
  return (state: EditorState): NodePair | null => {
    const parent = findParentNode(() => true)(state.selection);

    if (!parent) {
      return null;
    }

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

    let findResult: NodePair | null = null;
    parent.node.nodesBetween(start, end, (node, pos, parent) => {
      if (findResult) {
        return false;
      }
      const mark = node.marks.find((mark) => mark.type === markType);
      if (mark) {
        findResult = {
          node,
          pos,
          parent,
        };
        return false;
      }
      return true;
    });

    if (findResult === null) {
      return null;
    }

    return findResult;
  };
};

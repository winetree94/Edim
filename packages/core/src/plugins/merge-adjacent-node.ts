import { Plugin as PMPlugin, Transaction } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { canJoin } from 'prosemirror-transform';
import { NodePair } from '../types';

export interface EdimMergeAdjacentNodeOption {
  nodeType: NodeType;
  beforeMergeTransaction?: (tr: Transaction, joinPos: number) => Transaction;
}

export interface EdimMergeAdjacentNodePluginConfigs {
  specs: EdimMergeAdjacentNodeOption[];
}

/**
 * @description
 * 인접한 동일한 타입의 Node 가 Join 가능한 경우 자동 Join
 */
export const edimMergeAdjacentNodePlugins = (
  configs: EdimMergeAdjacentNodePluginConfigs,
): PMPlugin[] => {
  // const types = configs.specs.map((spec) =>  spec.nodeType);
  const plugin = new PMPlugin({
    appendTransaction: (transactions, oldState, newState) => {
      const types = configs.specs.map((spec) => spec.nodeType);
      if (!transactions.length) {
        return null;
      }
      let selection = newState.selection;
      let tr = newState.tr;

      const nodeTypes: NodePair[] = [];
      tr.doc.descendants((node, pos, parent) => {
        if (types.includes(node.type)) {
          nodeTypes.push({ node, pos, parent });
        }
      });

      nodeTypes.reverse().reduce((tr, { pos, node }, index, self) => {
        const previous = self[index + 1];
        if (
          previous &&
          previous.node.type === node.type &&
          previous.pos + previous.node.nodeSize === pos &&
          canJoin(tr.doc, pos)
        ) {
          const joinPredicate = configs.specs.find(
            (spec) => spec.nodeType === self[index].node.type,
          )?.beforeMergeTransaction;
          tr = joinPredicate?.(tr, pos) || tr;
          tr = tr.join(pos);
        }
        return tr;
      }, tr);

      selection = newState.selection.map(tr.doc, tr.mapping);
      tr = tr.setSelection(selection);
      return tr.steps.length ? tr : null;
    },
  });

  return [plugin];
};

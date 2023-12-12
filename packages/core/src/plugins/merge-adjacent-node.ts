import { Plugin as PMPlugin, Transaction } from 'prosemirror-state';
import { canJoin } from 'prosemirror-transform';
import { NodePair, NodeTypeOrGetter } from '../types';
import { parseNodeType } from '../utils';

export interface EdimMergeAdjacentNodeOption {
  nodeType: NodeTypeOrGetter;
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
      const types = configs.specs.map((spec) =>
        parseNodeType(spec.nodeType, newState),
      );
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

      nodeTypes.reverse().reduce((tr, { pos }, index, self) => {
        if (
          self[index + 1] &&
          canJoin(tr.doc, pos) &&
          self[index + 1].node.type === self[index].node.type
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

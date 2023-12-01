import { NodeSpec } from 'prosemirror-model';
import { NodePair } from 'prosemirror-preset-utils';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { canJoin } from 'prosemirror-transform';

export interface PmpMergeAdjacentNodePluginConfigs {
  listTypes: NodeSpec[];
}

/**
 * @description
 * 인접한 동일한 타입의 Node 가 Join 가능한 경우 자동 Join
 */
export const createPmpMergeAdjacentNodePlugins = (
  configs: PmpMergeAdjacentNodePluginConfigs,
): PMPlugin[] => {
  const plugin = new PMPlugin({
    appendTransaction: (transactions, oldState, newState) => {
      if (!transactions.length) {
        return null;
      }
      let selection = newState.selection;
      let tr = newState.tr;

      const listNodes: NodePair[] = [];
      tr.doc.descendants((node, pos, parent) => {
        if (configs.listTypes.includes(node.type)) {
          listNodes.push({ node, pos, parent });
        }
      });

      listNodes.reverse().reduce((tr, { pos }, index, self) => {
        if (self[index + 1] && canJoin(tr.doc, pos)) {
          tr.join(pos);
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

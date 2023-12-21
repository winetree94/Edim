import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin } from 'prosemirror-state';
import { createNode } from '../utils';
import { EdimFlatTaskListItemAttrs } from '../schemas';

export interface EdimTaskListItemNodeViewPluginConfigs {
  taskListItemNodeType: NodeType;
}

export const edimTaskListItemNodeViewPlugins = (
  configs: EdimTaskListItemNodeViewPluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [
    new PMPlugin({
      props: {
        nodeViews: {
          [configs.taskListItemNodeType.name]: (node, view, getPos) => {
            const li = createNode(node);

            li.addEventListener('mousedown', (event) => {
              const firstChild = li.firstElementChild as HTMLElement;
              const rect = firstChild.getBoundingClientRect();
              const clickX = event.clientX;
              const startX = rect.left - 30;
              const endX = rect.left - 5;

              if (clickX > endX || clickX < startX) {
                return;
              }

              event.preventDefault();
              event.stopPropagation();

              const pos = getPos();
              if (pos === undefined) {
                return;
              }

              const attrs = node.attrs as EdimFlatTaskListItemAttrs;
              const tr = view.state.tr.setNodeMarkup(
                pos,
                configs.taskListItemNodeType,
                {
                  ...attrs,
                  checked: !attrs.checked,
                },
              );
              view.dispatch(tr);
            });

            return {
              dom: li,
              contentDOM: li,
              destroy: () => {},
            };
          },
        },
      },
    }),
  ];
  return plugins;
};

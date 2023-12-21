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
              const rect = li.getBoundingClientRect();
              const clickX = event.clientX;
              const liLeftX = rect.left;

              const paddingLeftValue = li
                .computedStyleMap()
                .get('padding-left') as CSSUnitValue;
              const paddingLeft = paddingLeftValue.value;

              if (clickX > liLeftX + paddingLeft) {
                return;
              }

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

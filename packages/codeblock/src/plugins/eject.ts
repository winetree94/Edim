import { Plugin as PMPlugin } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { isInCodeBlock } from '../utils';
import { findParentNode } from 'prosemirror-utils';

export interface EdimCodeBlockEjectPluginConfigs {
  nodeType: NodeType;
}

export const edimCodeBlockEjectPlugins = (
  configs: EdimCodeBlockEjectPluginConfigs,
): PMPlugin[] => {
  const plugins: PMPlugin[] = [
    new PMPlugin({
      props: {
        handleKeyDown: (view, event) => {
          if (!['ArrowRight', 'ArrowDown'].includes(event.key)) {
            return;
          }

          if (!isInCodeBlock(view.state, configs.nodeType)) {
            return false;
          }

          const { from, to } = view.state.selection;
          if (from !== to) {
            return false;
          }

          const codeblock = findParentNode(
            (node) => node.type === configs.nodeType,
          )(view.state.selection);

          if (!codeblock) {
            return false;
          }

          const isLastPos =
            codeblock.pos + codeblock.node.nodeSize - 1 === from;

          if (!isLastPos) {
            return false;
          }

          if (
            view.state.doc.content.size !==
            codeblock.pos + codeblock.node.nodeSize
          ) {
            return false;
          }

          view.dispatch(
            view.state.tr
              .insert(
                codeblock.pos + codeblock.node.nodeSize,
                view.state.schema.nodes['paragraph'].create(),
              )
              .scrollIntoView(),
          );

          return false;
        },
      },
    }),
  ];

  return plugins;
};

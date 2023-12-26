import { Plugin as PMPlugin, TextSelection } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { isInCodeBlock } from '../utils';
import { findParentNode } from 'prosemirror-utils';
import { keymap } from 'prosemirror-keymap';
import { findNearestBlockContainer } from '@edim-editor/core';

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

          const nearestBlockContainer = findNearestBlockContainer(
            view.state.selection,
          ) || {
            pos: 0,
            node: view.state.doc,
          };

          const isLastNode =
            nearestBlockContainer.node.lastChild === codeblock.node;

          if (!isLastNode) {
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
    keymap({
      Enter: (state, dispatch) => {
        if (!isInCodeBlock(state, configs.nodeType)) {
          return false;
        }

        const { from, to } = state.selection;
        if (from !== to) {
          return false;
        }

        const codeblock = findParentNode(
          (node) => node.type === configs.nodeType,
        )(state.selection);

        if (!codeblock) {
          return false;
        }

        const isLastPos = codeblock.pos + codeblock.node.nodeSize - 1 === from;

        if (!isLastPos) {
          return false;
        }

        const matched =
          codeblock.node.textContent.slice(
            codeblock.node.textContent.length - 2,
          ) === '\n\n';

        if (!matched) {
          return false;
        }

        const nearestBlockContainer = findNearestBlockContainer(
          state.selection,
        ) || {
          pos: 0,
          node: state.doc,
        };

        const isLastNode =
          nearestBlockContainer.node.lastChild === codeblock.node;

        let tr = state.tr;

        tr = state.tr.delete(
          codeblock.pos + codeblock.node.nodeSize - 3,
          codeblock.pos + codeblock.node.nodeSize,
        );

        if (isLastNode) {
          tr = tr.insert(
            codeblock.pos + codeblock.node.nodeSize - 2,
            state.schema.nodes['paragraph'].create(),
          );
        }

        tr.setSelection(
          TextSelection.create(
            tr.doc,
            codeblock.pos + codeblock.node.nodeSize - 2 + 1,
          ),
        );

        if (dispatch) {
          dispatch(tr.scrollIntoView());
        }

        return true;
      },
    }),
  ];

  return plugins;
};

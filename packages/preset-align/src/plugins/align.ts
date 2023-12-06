import { Plugin as PMPlugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { NodePair } from 'prosemirror-preset-core';

export interface AlignAttrs {
  align: 'left' | 'right' | 'center';
}

export const createPmpAlignPlugins = (): PMPlugin[] => {
  const plugin: PMPlugin<DecorationSet> = new PMPlugin<DecorationSet>({
    state: {
      init: () => DecorationSet.empty,
      apply: (tr, set, oldState, newState) => {
        const nodes: NodePair[] = [];
        newState.doc.nodesBetween(
          0,
          newState.doc.content.size,
          (node, pos, parent) => {
            if (!node.type.spec.attrs?.['align']) {
              return true;
            }
            const attrs = node.attrs as AlignAttrs;
            if (attrs.align === 'left') {
              return true;
            }
            nodes.push({ node, pos, parent });
            return true;
          },
        );

        if (nodes.length === 0) {
          return DecorationSet.empty;
        }

        const decorations = nodes.map(({ node, pos, parent }) => {
          const { align } = node.attrs as AlignAttrs;
          const start = pos + 1;
          const end = start + node.nodeSize - 2;
          const element = document.createElement('div');
          return Decoration.widget(pos, element);
        });

        return DecorationSet.create(newState.doc, decorations);
      },
    },
    props: {
      decorations: (state) => plugin.getState(state),
    },
  });
  return [plugin];
};

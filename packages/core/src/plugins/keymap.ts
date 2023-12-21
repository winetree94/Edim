import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';

export const edimBasicKeymapPlugins = (): Plugin[] => {
  return [
    keymap({
      /**
       * Switch to the default node of the Schema when the first node is empty.
       */
      Backspace: (state, dispatch) => {
        const selection = state.selection;

        if (!selection.empty || selection.from !== selection.to) {
          return false;
        }

        const firstNodeOfDoc = state.doc.firstChild;

        if (!firstNodeOfDoc) {
          return false;
        }

        if (firstNodeOfDoc !== selection.$from.parent) {
          return false;
        }

        const firstNode = selection.$from.parent;
        if (firstNode.content.size !== 0) {
          return false;
        }

        const firstNodeFromSchema = Object.values(state.schema.nodes).find(
          (type) =>
            type.spec.group === 'block' &&
            type.spec.content?.includes('inline'),
        );

        if (!firstNodeFromSchema) {
          throw new Error('Cannot find first block node from schema');
        }

        if (firstNodeFromSchema === firstNode.type) {
          return false;
        }

        const newNode = firstNodeFromSchema.createAndFill();

        if (!newNode) {
          return false;
        }

        const tr = state.tr.setNodeMarkup(0, firstNodeFromSchema);
        dispatch?.(tr);

        return true;
      },
    }),
    keymap(baseKeymap),
  ];
};

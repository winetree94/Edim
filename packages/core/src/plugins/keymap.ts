import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';
import { clearMarks } from '../commands';

export const edimBasicKeymapPlugins = (): Plugin[] => {
  return [
    keymap({
      /**
       * Prevents focus from leaving when the Tab key is pressed.
       */
      'Shift-Tab': () => true,
      Tab: () => true,

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

        let tr = state.tr.setStoredMarks([]);

        const firstNodeFromSchema = Object.values(state.schema.nodes).find(
          (type) =>
            type.spec.group === 'block' &&
            type.spec.content?.includes('inline'),
        );

        if (!firstNodeFromSchema) {
          throw new Error('Cannot find first block node from schema');
        }

        if (firstNodeFromSchema === firstNode.type) {
          dispatch?.(tr);
          return true;
        }

        const newNode = firstNodeFromSchema.createAndFill();

        if (!newNode) {
          dispatch?.(tr);
          return true;
        }

        tr = tr.setNodeMarkup(0, firstNodeFromSchema);
        dispatch?.(tr);
        return true;
      },
      'Mod-\\': clearMarks(),
    }),
    keymap(baseKeymap),
  ];
};

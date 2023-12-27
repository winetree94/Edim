import {
  Plugin as PMPlugin,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function isTextSelection(selection: Selection): selection is TextSelection {
  return selection && typeof selection === 'object' && '$cursor' in selection;
}

export const edimSelectionElementPlugins = (): PMPlugin[] => {
  const element = document.createElement('div');
  element.classList.add('edim-selection-element');
  element.style.position = 'fixed';
  element.style.border = '1px solid red';

  const plugin = new PMPlugin({
    // view: (editorView) => {
    //   const clear = () => {
    //     if (element.parentElement) {
    //       element.remove();
    //     }
    //   };

    //   const apply = () => {
    //     const selection = editorView.state.selection;
    //     if (!selection.empty) {
    //       clear();
    //       return;
    //     }
    //     const fromPos = editorView.coordsAtPos(selection.from);
    //     const endPos = editorView.coordsAtPos(selection.to);

    //     element.style.top = `${fromPos.top}px`;
    //     element.style.height = `${endPos.bottom - fromPos.top}px`;
    //     element.style.left = `${fromPos.left}px`;

    //     if (!element.parentElement) {
    //       editorView.dom.parentElement?.appendChild(element);
    //     }
    //   };
    //   apply();

    //   return {
    //     update: (view, prevState) => apply(),
    //     destroy: () => clear(),
    //   };
    // },
    props: {
      decorations: (state) => {
        if (
          !element ||
          !isTextSelection(state.selection) ||
          !state.selection.empty
        ) {
          return;
        }

        return DecorationSet.create(state.doc, [
          Decoration.widget(0, element, {
            key: 'prosemirror-virtual-cursor',
          }),
        ]);
      },
    },
  });
  return [plugin];
};

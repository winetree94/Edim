import { Plugin as PMPlugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { isTextSelection } from '../utils';

export const edimSelectionElementPlugins = (): PMPlugin[] => {
  const element = document.createElement('span');
  element.classList.add('edim-selection-element');
  element.style.position = 'absolute';

  const plugin: PMPlugin<DecorationSet> = new PMPlugin<DecorationSet>({
    view: (editorView) => {
      const apply = () => {
        const selection = editorView.state.selection;
        if (!selection.empty) {
          return;
        }

        const viewPos = editorView.dom.getBoundingClientRect();
        const fromPos = editorView.coordsAtPos(selection.from);
        const endPos = editorView.coordsAtPos(selection.to);

        element.style.top = `${fromPos.top - viewPos.top}px`;
        element.style.left = `${fromPos.left - viewPos.left}px`;
        element.style.height = `${endPos.bottom - fromPos.top}px`;

        if (!element.parentElement) {
          editorView.dom.parentElement?.appendChild(element);
        }
      };
      apply();

      return {
        update: () => apply(),
      };
    },
    state: {
      init: () => DecorationSet.empty,
      apply: (tr, oldState, newState) => {
        if (
          !element ||
          !isTextSelection(newState.selection) ||
          !newState.selection.empty
        ) {
          return DecorationSet.empty;
        }

        const widget = Decoration.widget(0, element, {
          key: 'edim-selection-element',
        });

        return DecorationSet.create(newState.doc, [widget]);
      },
    },
    props: {
      decorations: (state) => {
        return plugin.getState(state);
      },
    },
  });
  return [plugin];
};

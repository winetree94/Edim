import type { ResolvedPos } from 'prosemirror-model';
import { Mark } from 'prosemirror-model';
import type { Selection } from 'prosemirror-state';
import { Plugin as PMPlugin, TextSelection } from 'prosemirror-state';

/**
 * Origin Project & License
 * https://github.com/ocavue/prosemirror-virtual-cursor
 */
export function edimVirtualCursorPlugins(): PMPlugin[] {
  const plugins = [
    new PMPlugin({
      props: {
        handleKeyDown: (view, event): boolean => {
          const { selection } = view.state;

          if (
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.isComposing ||
            !['ArrowLeft', 'ArrowRight'].includes(event.key) ||
            !isTextSelection(selection) ||
            !selection.empty
          ) {
            return false;
          }

          const $pos = selection.$head;
          const [marksBefore, marksAfter] = getMarksAround($pos);
          const marks = view.state.storedMarks || $pos.marks();

          // Don't move the cursor, only change the stored marks
          if (
            marksBefore &&
            marksAfter &&
            !Mark.sameSet(marksBefore, marksAfter)
          ) {
            /**
             * If the marks before or after the cursor are exclusive, don't move the cursor
             */
            if (
              [...marksBefore, ...marksAfter].find(
                (m) => m?.type.spec.inclusive === false,
              )
            ) {
              return false;
            }

            if (
              event.key === 'ArrowLeft' &&
              !Mark.sameSet(marksBefore, marks)
            ) {
              view.dispatch(view.state.tr.setStoredMarks(marksBefore));
              return true;
            }

            if (
              event.key === 'ArrowRight' &&
              !Mark.sameSet(marksAfter, marks)
            ) {
              view.dispatch(view.state.tr.setStoredMarks(marksAfter));
              return true;
            }
          }

          const hasInexclusiveMark = marks.find(
            (m) => m?.type.spec.inclusive === false,
          );

          // Move the cursor and also change the stored marks
          if (
            event.key === 'ArrowLeft' &&
            $pos.textOffset === 1 &&
            !hasInexclusiveMark
          ) {
            view.dispatch(
              view.state.tr
                .setSelection(
                  TextSelection.create(view.state.doc, $pos.pos - 1),
                )
                .setStoredMarks($pos.marks()),
            );
            return true;
          }

          if (
            event.key === 'ArrowRight' &&
            $pos.textOffset + 1 ===
              $pos.parent.maybeChild($pos.index())?.nodeSize &&
            !hasInexclusiveMark
          ) {
            view.dispatch(
              view.state.tr
                .setSelection(
                  TextSelection.create(view.state.doc, $pos.pos + 1),
                )
                .setStoredMarks($pos.marks()),
            );
            return true;
          }

          return false;
        },
      },
    }),
  ];

  return plugins;
}

function getMarksAround($pos: ResolvedPos) {
  const index = $pos.index();
  const after = $pos.parent.maybeChild(index);

  // When inside a text node, just return the text node's marks
  let before = $pos.textOffset ? after : null;

  if (!before && index > 0) {
    before = $pos.parent.maybeChild(index - 1);
  }

  return [before?.marks.slice() || [], after?.marks.slice() || []] as const;
}

function isTextSelection(selection: Selection): selection is TextSelection {
  return selection && typeof selection === 'object' && '$cursor' in selection;
}

import { Command } from 'prosemirror-state';

/**
 * To initiate a mention input, insert the @ character.
 * If there is no space before the current cursor position, it will be inserted along with a space.
 */
export const addMention = (): Command => {
  return (state, dispatch) => {
    let tr = state.tr;
    const selection = state.selection;

    if (selection.$from.parent !== selection.$to.parent) {
      return false;
    }

    if (!selection.$from.parent.isTextblock) {
      return false;
    }

    if (
      !selection.$from.nodeBefore ||
      selection.$from.nodeBefore?.textContent[
        selection.$from.parentOffset - 1
      ] === ' '
    ) {
      tr = tr.insertText('@', selection.from);
    } else {
      tr = tr.insertText(' @', selection.from);
    }

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
};

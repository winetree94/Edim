import { Command } from 'prosemirror-state';

export const clearMarks = (): Command => (state, dispatch) => {
  const { from, to } = state.selection;
  const tr = state.tr;
  tr.removeMark(from, to);
  tr.setStoredMarks([]);
  if (dispatch) {
    dispatch(tr);
  }
  return true;
};

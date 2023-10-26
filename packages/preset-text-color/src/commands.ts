import { EditorState } from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';

export const setTextColor = (state: EditorState, color: string) => {
  let tr = state.tr;
  const { from, to } = state.selection;

  tr = tr.addMark(
    from,
    to,
    state.schema.marks['textColor'].create({
      color,
    }),
  );

  return tr;

  // this._editorView.dispatch(tr);
  // this._editorView.focus();
};

import { EditorState } from 'prosemirror-state';

export const getRangeFirstAlignment = (state: EditorState) => {
  const { from, to } = state.selection;
  const aligns: ('left' | 'right' | 'center')[] = [];
  state.doc.nodesBetween(from, to, (node) => {
    if (node.type.spec.attrs?.['align']) {
      aligns.push(node.attrs['align'] as 'left' | 'right' | 'center');
      return false;
    }
    return true;
  });
  return aligns.length === 0 ? null : aligns[0];
};

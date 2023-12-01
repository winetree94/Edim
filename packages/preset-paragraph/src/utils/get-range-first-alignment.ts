import { EditorState } from 'prosemirror-state';

export const getRangeFirstAlignment = (state: EditorState) => {
  const { from, to } = state.selection;
  const aligns: ('left' | 'right' | 'center')[] = [];
  state.doc.nodesBetween(from, to, (node) => {
    if (node.type.spec.group?.includes('disable-paragraph-attributes')) {
      return false;
    }
    if (node.type.spec.attrs?.['textAlign']) {
      aligns.push(node.attrs['textAlign'] as 'left' | 'right' | 'center');
      return false;
    }
    return true;
  });
  return aligns.length === 0 ? null : aligns[0];
};

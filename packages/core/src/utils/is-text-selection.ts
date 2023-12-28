import { Selection, TextSelection } from 'prosemirror-state';

export const isTextSelection = (
  selection: Selection,
): selection is TextSelection => {
  return selection && typeof selection === 'object' && '$cursor' in selection;
};

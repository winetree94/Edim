import { gapCursor } from 'prosemirror-gapcursor';

export const edimGapCursorPlugins = () => {
  return [gapCursor()];
};

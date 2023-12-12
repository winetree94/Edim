import { dropCursor } from 'prosemirror-dropcursor';

export const edimDropCursorPlugins = () => {
  return [dropCursor()];
};

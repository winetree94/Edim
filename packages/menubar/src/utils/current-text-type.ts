import { EditorState } from 'prosemirror-state';
import { EdimHeadingAttrs } from '@edim-editor/heading';

export const getTextType = (state: EditorState) => {
  const { selection } = state;
  const { $from, $to } = selection;

  if (
    $from.parent === $to.parent &&
    $from.parent.type === state.schema.nodes['heading']
  ) {
    const attrs = $from.parent.attrs as EdimHeadingAttrs;
    return `h${attrs.level}`;
  }

  return 'p';
};

import { getBlockContainerChildren } from '@edim-editor/core';
import { EditorState } from 'prosemirror-state';

export const getAlignType = (state: EditorState) => {
  const { selection } = state;
  const { $from, $to } = selection;

  // const children = getBlockContainerChildren(state.doc, $from.pos, $to.pos);

  // if (
  //   $from.parent === $to.parent &&
  //   $from.parent.type === state.schema.nodes['heading']
  // ) {
  //   const attrs = $from.parent.attrs;
  //   return `h${attrs.level}`;
  // }

  return 'p';
};

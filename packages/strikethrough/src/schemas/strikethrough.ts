import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

export const EDIM_STRIKETHROUGH_MARK_NAME = 'strikethrough';

const strikethroughDOM: DOMOutputSpec = ['s', 0];
export const edimStrikethroughMarks = (): Record<string, MarkSpec> => ({
  [EDIM_STRIKETHROUGH_MARK_NAME]: {
    parseDOM: [{ tag: 's' }],
    toDOM() {
      return strikethroughDOM;
    },
  },
});

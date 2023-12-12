import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const strikethroughDOM: DOMOutputSpec = ['s', 0];
export const edimStrikeThroughMarks = (): Record<string, MarkSpec> => ({
  strikethrough: {
    parseDOM: [{ tag: 's' }],
    toDOM() {
      return strikethroughDOM;
    },
  },
});

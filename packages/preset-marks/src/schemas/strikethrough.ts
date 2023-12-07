import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const strikethroughDOM: DOMOutputSpec = ['s', 0];
export const PMP_STRIKETHROUGH_MARK: Record<string, MarkSpec> = {
  strikethrough: {
    parseDOM: [{ tag: 's' }],
    toDOM() {
      return strikethroughDOM;
    },
  },
};

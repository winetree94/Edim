import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const emDOM: DOMOutputSpec = ['em', 0];
export const edimItalicMarks = (): Record<string, MarkSpec> => ({
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
  em: {
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
      { style: 'font-style=normal', clearMark: (m) => m.type.name == 'em' },
    ],
    toDOM() {
      return emDOM;
    },
  },
});

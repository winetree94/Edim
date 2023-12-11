import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const codeDOM: DOMOutputSpec = ['code', { class: 'edim-code' }, 0];
export const EDIM_CODE_MARKS: Record<string, MarkSpec> = {
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    },
  },
};

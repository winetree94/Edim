import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

export const EDIM_CODE_MARK_NAME = 'code';

const codeDOM: DOMOutputSpec = ['code', { class: 'edim-code' }, 0];
export const edimCodeMarks = (): Record<string, MarkSpec> => ({
  [EDIM_CODE_MARK_NAME]: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    },
  },
});

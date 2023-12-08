import { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

const codeDOM: DOMOutputSpec = ['code', { class: 'pmp-code' }, 0];
export const PMP_CODE_MARK: Record<string, MarkSpec> = {
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    },
  },
};

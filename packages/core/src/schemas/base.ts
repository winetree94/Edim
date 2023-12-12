import { NodeSpec } from 'prosemirror-model';

export const edimBaseNodes = (): Record<string, NodeSpec> => ({
  doc: {
    group: 'block-container',
    content: 'block+',
  },
  text: {
    group: 'inline',
  },
});

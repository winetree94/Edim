import { NodeSpec } from 'prosemirror-model';

export const PMP_DOC_NODE: Record<string, NodeSpec> = {
  doc: {
    group: 'block-container',
    content: 'block+',
  },
};

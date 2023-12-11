import { NodeSpec } from 'prosemirror-model';

export const EDIM_DOC_NODES: Record<string, NodeSpec> = {
  doc: {
    group: 'block-container',
    content: 'block+',
  },
};

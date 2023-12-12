import { createEnsuredNodeType } from '@edim-editor/core';
import { EDIM_BLOCKQUOTE_NODE_NAME } from '../schemas';

export const checkBlockquoteNodeType = createEnsuredNodeType(
  EDIM_BLOCKQUOTE_NODE_NAME,
);

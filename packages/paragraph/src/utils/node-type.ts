import { createEnsuredNodeType } from '@edim-editor/core';
import { EDIM_PARAGRAPH_DEFAULT_NODE_NAME } from '../schemas';

export const checkParagraphNodeType = createEnsuredNodeType(
  EDIM_PARAGRAPH_DEFAULT_NODE_NAME,
);

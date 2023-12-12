import { createEnsuredNodeType } from '@edim-editor/core';
import { EDIM_CODEBLOCK_NODE_NAME } from '../schemas';

export const checkCodeblockNodeType = createEnsuredNodeType(
  EDIM_CODEBLOCK_NODE_NAME,
);

import { createEnsuredNodeType } from '@edim-editor/core';
import { EDIM_HEADING_NODE_NAME } from '../schemas';

export const checkHeadingNodeType = createEnsuredNodeType(
  EDIM_HEADING_NODE_NAME,
);
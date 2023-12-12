import { createEnsuredNodeType } from '@edim-editor/core';
import { EDIM_HORIZONTAL_RULE_NODE_NAME } from '../schemas';

export const checkHorizontalNodeType = createEnsuredNodeType(
  EDIM_HORIZONTAL_RULE_NODE_NAME,
);

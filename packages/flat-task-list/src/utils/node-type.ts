import { createEnsuredNodeType } from '@edim-editor/core';
import {
  EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME,
  EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME
} from '../schemas';

export const checkTaskListNodeType = createEnsuredNodeType(
  EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME,
);

export const checkTaskListItemNodeType = createEnsuredNodeType(
  EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME,
);

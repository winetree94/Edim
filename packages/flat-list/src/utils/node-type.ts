import { createEnsuredNodeType } from '@edim-editor/core';
import {
  EDIM_DEFAULT_FLAT_BULLET_LIST_NODE_NAME,
  EDIM_DEFAULT_FLAT_LIST_ITEM_NODE_NAME,
  EDIM_DEFAULT_FLAT_ORDERED_LIST_NODE_NAME,
} from '../schemas';

export const checkOrderedListNodeType = createEnsuredNodeType(
  EDIM_DEFAULT_FLAT_ORDERED_LIST_NODE_NAME,
);

export const checkListItemNodeType = createEnsuredNodeType(
  EDIM_DEFAULT_FLAT_LIST_ITEM_NODE_NAME,
);

export const checkBulletListNodeType = createEnsuredNodeType(
  EDIM_DEFAULT_FLAT_BULLET_LIST_NODE_NAME,
);

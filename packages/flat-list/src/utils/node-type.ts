import { createEnsuredNodeType } from '@edim-editor/core';
import {
  EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME,
  EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME,
  EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME,
} from '../schemas';

export const checkOrderedListNodeType = createEnsuredNodeType(
  EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME,
);

export const checkListItemNodeType = createEnsuredNodeType(
  EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME,
);

export const checkBulletListNodeType = createEnsuredNodeType(
  EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME,
);

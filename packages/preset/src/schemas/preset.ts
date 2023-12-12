import { Schema } from 'prosemirror-model';

import { EDIM_DOC_NODES, EDIM_TEXT_NODES } from '@edim-editor/core';
import { EDIM_HEADING_NODES } from '@edim-editor/heading';
import { EDIM_PARAGRAPH_NODES } from '@edim-editor/paragraph';
import {
  EDIM_BULLET_FREE_LIST_NODES,
  EDIM_FREE_LIST_ITEM_NODES,
  EDIM_ORDERED_FREE_LIST_NODES,
} from '@edim-editor/flat-list';
import {
  EDIM_FLAT_TASK_LIST_NODES,
  EDIM_FLAT_TASK_LIST_ITEM_NODES,
} from '@edim-editor/flat-task-list';
import { EDIM_HORIZONTAL_RULE_NODES } from '@edim-editor/hr';
import { EDIM_LINK_MARKS } from '@edim-editor/link';
import { EDIM_BOLD_MARKS } from '@edim-editor/bold';
import { EDIM_CODE_MARKS } from '@edim-editor/code';
import { EDIM_FONT_FAMILY_MARKS } from '@edim-editor/font-family';
import { EDIM_ITALIC_MARKS } from '@edim-editor/italic';
import { EDIM_STRIKETHROUGH_MARKS } from '@edim-editor/strikethrough';
import { EDIM_SUBSCRIPT_MARKS } from '@edim-editor/subscript';
import { EDIM_SUPERSCRIPT_MARKS } from '@edim-editor/superscript';
import { EDIM_TEXT_COLOR_MARKS } from '@edim-editor/text-color';
import { EDIM_UNDERLINE_MARKS } from '@edim-editor/underline';
import { EDIM_BLOCKQUOTE_NODES } from '@edim-editor/blockquote';
import { EDIM_CODE_BLOCK_NODES } from '@edim-editor/codeblock';
import { EDIM_TABLE_NODES } from '../../../_wip_tables/src';

export const EDIM_PRESET_SCHEMA = new Schema({
  nodes: {
    ...EDIM_DOC_NODES,
    ...EDIM_TEXT_NODES,
    ...EDIM_PARAGRAPH_NODES,
    ...EDIM_BULLET_FREE_LIST_NODES,
    ...EDIM_FREE_LIST_ITEM_NODES,
    ...EDIM_ORDERED_FREE_LIST_NODES,
    ...EDIM_FLAT_TASK_LIST_NODES,
    ...EDIM_FLAT_TASK_LIST_ITEM_NODES,
    ...EDIM_BLOCKQUOTE_NODES,
    ...EDIM_HORIZONTAL_RULE_NODES,
    ...EDIM_HEADING_NODES,
    ...EDIM_CODE_BLOCK_NODES,
    ...EDIM_TABLE_NODES,
  },
  marks: {
    ...EDIM_BOLD_MARKS,
    ...EDIM_ITALIC_MARKS,
    ...EDIM_UNDERLINE_MARKS,
    ...EDIM_STRIKETHROUGH_MARKS,
    ...EDIM_CODE_MARKS,
    ...EDIM_SUBSCRIPT_MARKS,
    ...EDIM_SUPERSCRIPT_MARKS,
    ...EDIM_FONT_FAMILY_MARKS,
    ...EDIM_TEXT_COLOR_MARKS,
    ...EDIM_LINK_MARKS,
  },
});

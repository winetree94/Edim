import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { faker } from '@faker-js/faker';

import {
  EDIM_DOC_NODES,
  EDIM_TEXT_NODES,
  createEdimCorePlugins,
} from '@edim-editor/core';
import {
  EDIM_HEADING_NODES,
  createEdimHeadingPlugins,
} from '@edim-editor/heading';
import {
  createEdimParagraphPlugins,
  EDIM_PARAGRAPH_NODES,
} from '@edim-editor/paragraph';
import {
  EDIM_BULLET_FREE_LIST_NODES,
  EDIM_FREE_LIST_ITEM_NODES,
  EDIM_ORDERED_FREE_LIST_NODES,
  createEdimFlatListPlugins,
} from '@edim-editor/flat-list';
import {
  EDIM_FLAT_TASK_LIST_NODES,
  EDIM_FLAT_TASK_LIST_ITEM_NODES,
  createEdimFlatTaskListPlugins,
} from '@edim-editor/flat-task-list';
import {
  EDIM_HORIZONTAL_RULE_NODES,
  createEdimHorizontalRulePlugins,
} from '@edim-editor/hr';
import {
  EDIM_IMAGE_NODES,
  creatEdimImagePlugins,
  EdimImagePlaceholderViewProvider,
} from '@edim-editor/image';
// import {
//   EDIM_MENTION_MARK,
//   createEdimMentionPlugins,
//   MentionItem,
//   EdimMentionView,
// } from '@edim-editor/mention';
import { EDIM_LINK_MARKS } from '@edim-editor/link';
import {
  EDIM_BOLD_MARKS,
  createEdimBoldPlugins,
} from '@edim-editor/bold';
import {
  EDIM_CODE_MARKS,
  createEdimCodePlugins,
} from '@edim-editor/code';
import { EDIM_FONT_FAMILY_MARKS } from '@edim-editor/font-family';
import {
  EDIM_ITALIC_MARKS,
  createEdimItalicPlugins,
} from '@edim-editor/italic';
import {
  EDIM_STRIKETHROUGH_MARKS,
  createEdimStrikethroughPlugins,
} from '@edim-editor/strikethrough';
import {
  EDIM_SUBSCRIPT_MARKS,
  createEdimSubscriptPlugins,
} from '@edim-editor/subscript';
import {
  EDIM_SUPERSCRIPT_MARKS,
  createEdimSuperscriptPlugins,
} from '@edim-editor/superscript';
import { EDIM_TEXT_COLOR_MARKS } from '@edim-editor/text-color';
import {
  EDIM_UNDERLINE_MARKS,
  createEdimUnderlinePlugins,
} from '@edim-editor/underline';
import {
  EDIM_BLOCKQUOTE_NODES,
  createEdimBlockQuotePlugins,
} from '@edim-editor/blockquote';
import {
  EDIM_CODE_BLOCK_NODES,
  createCodeBlockPlugins,
} from '@edim-editor/codeblock';
import {
  EDIM_TABLE_NODES,
  createEdimTableEditingPlugins,
  createEdimTablePlugins,
} from '@edim-editor/tables';
// import { EDIM_EMOJI_NODE } from '@edim-editor/emoji';
// import {
//   createEdimCommandPlugins,
//   EdimCommandView,
// } from '@edim-editor/command';
import { createEdimMenubarPlugins } from '@edim-editor/menubar';

// const items: MentionItem[] = Array.from({ length: 100 }).map(() => ({
//   icon: faker.image.avatar(),
//   id: faker.string.uuid(),
//   name: faker.person.fullName(),
// }));

export const maximumSchema = new Schema({
  nodes: {
    ...EDIM_DOC_NODES,
    ...EDIM_TEXT_NODES,
    ...EDIM_PARAGRAPH_NODES,
    // EDIM_EMOJI_NODE,
    ...EDIM_BULLET_FREE_LIST_NODES,
    ...EDIM_FREE_LIST_ITEM_NODES,
    ...EDIM_ORDERED_FREE_LIST_NODES,
    ...EDIM_FLAT_TASK_LIST_NODES,
    ...EDIM_FLAT_TASK_LIST_ITEM_NODES,
    ...EDIM_BLOCKQUOTE_NODES,
    ...EDIM_HORIZONTAL_RULE_NODES,
    ...EDIM_HEADING_NODES,
    ...EDIM_CODE_BLOCK_NODES,
    ...EDIM_IMAGE_NODES,
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
    // EDIM_MENTION_MARK,
    ...EDIM_LINK_MARKS,
  },
});

export const maximumPlugins: Plugin[] = [
  ...createEdimParagraphPlugins({
    nodeType: maximumSchema.nodes['paragraph'],
  }),
  ...createEdimFlatListPlugins({
    orderListNodeType: maximumSchema.nodes['ordered_list'],
    bulletListNodeType: maximumSchema.nodes['bullet_list'],
    listItemNodeType: maximumSchema.nodes['list_item'],
  }),
  ...createEdimFlatTaskListPlugins({
    taskListNodeType: maximumSchema.nodes['task_list'],
    taskListItemNodeType: maximumSchema.nodes['task_list_item'],
  }),
  ...createEdimBlockQuotePlugins({
    nodeType: maximumSchema.nodes['blockquote'],
    mergeAdjacentBlockquote: true,
  }),
  ...createEdimHorizontalRulePlugins({
    nodeType: maximumSchema.nodes['horizontal_rule'],
  }),
  ...createEdimHeadingPlugins({
    nodeType: maximumSchema.nodes['heading'],
    level: 6,
  }),
  ...createCodeBlockPlugins({
    nodeType: maximumSchema.nodes['code_block'],
  }),
  ...creatEdimImagePlugins({
    placeholderViewProvider: () => new EdimImagePlaceholderViewProvider(),
  }),
  ...createEdimItalicPlugins({
    markType: maximumSchema.marks['em'],
  }),
  ...createEdimBoldPlugins({
    markType: maximumSchema.marks['strong'],
  }),
  ...createEdimCodePlugins({
    markType: maximumSchema.marks['code'],
  }),
  ...createEdimTablePlugins({}),
  ...createEdimTableEditingPlugins(),
  ...createEdimCorePlugins(),
  ...createEdimUnderlinePlugins({
    markType: maximumSchema.marks['underline'],
  }),
  ...createEdimStrikethroughPlugins({
    markType: maximumSchema.marks['strikethrough'],
  }),
  ...createEdimSubscriptPlugins({
    markType: maximumSchema.marks['subscript'],
  }),
  ...createEdimSuperscriptPlugins({
    markType: maximumSchema.marks['superscript'],
  }),
  ...createEdimMenubarPlugins(),
];

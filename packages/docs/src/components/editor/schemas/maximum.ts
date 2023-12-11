import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { faker } from '@faker-js/faker';

import {
  EDIM_DOC_NODES,
  EDIM_TEXT_NODES,
  createEdimCorePlugins,
} from 'prosemirror-preset-core';
import {
  EDIM_HEADING_NODES,
  createEdimHeadingPlugins,
} from 'prosemirror-preset-heading';
import {
  createEdimParagraphPlugins,
  EDIM_PARAGRAPH_NODES,
} from 'prosemirror-preset-paragraph';
import {
  EDIM_BULLET_FREE_LIST_NODES,
  EDIM_FREE_LIST_ITEM_NODES,
  EDIM_ORDERED_FREE_LIST_NODES,
  createEdimFlatListPlugins,
} from 'prosemirror-preset-flat-list';
import {
  EDIM_FLAT_TASK_LIST_NODES,
  EDIM_FLAT_TASK_LIST_ITEM_NODES,
  createEdimFlatTaskListPlugins,
} from 'prosemirror-preset-flat-task-list';
import {
  EDIM_HORIZONTAL_RULE_NODES,
  createEdimHorizontalRulePlugins,
} from 'prosemirror-preset-hr';
import {
  EDIM_IMAGE_NODES,
  creatEdimImagePlugins,
  EdimImagePlaceholderViewProvider,
} from 'prosemirror-preset-image';
// import {
//   EDIM_MENTION_MARK,
//   createEdimMentionPlugins,
//   MentionItem,
//   EdimMentionView,
// } from 'prosemirror-preset-mention';
import { EDIM_LINK_MARKS } from 'prosemirror-preset-link';
import {
  EDIM_BOLD_MARKS,
  createEdimBoldPlugins,
} from 'prosemirror-preset-bold';
import {
  EDIM_CODE_MARKS,
  createEdimCodePlugins,
} from 'prosemirror-preset-code';
import { EDIM_FONT_FAMILY_MARKS } from 'prosemirror-preset-font-family';
import {
  EDIM_ITALIC_MARKS,
  createEdimItalicPlugins,
} from 'prosemirror-preset-italic';
import {
  EDIM_STRIKETHROUGH_MARKS,
  createEdimStrikethroughPlugins,
} from 'prosemirror-preset-strikethrough';
import {
  EDIM_SUBSCRIPT_MARKS,
  createEdimSubscriptPlugins,
} from 'prosemirror-preset-subscript';
import {
  EDIM_SUPERSCRIPT_MARKS,
  createEdimSuperscriptPlugins,
} from 'prosemirror-preset-superscript';
import { EDIM_TEXT_COLOR_MARKS } from 'prosemirror-preset-text-color';
import {
  EDIM_UNDERLINE_MARKS,
  createEdimUnderlinePlugins,
} from 'prosemirror-preset-underline';
import {
  EDIM_BLOCKQUOTE_NODES,
  createEdimBlockQuotePlugins,
} from 'prosemirror-preset-blockquote';
import {
  EDIM_CODE_BLOCK_NODES,
  createCodeBlockPlugins,
} from 'prosemirror-preset-codeblock';
import {
  EDIM_TABLE_NODES,
  createEdimTableEditingPlugins,
  createEdimTablePlugins,
} from 'prosemirror-preset-tables';
// import { EDIM_EMOJI_NODE } from 'prosemirror-preset-emoji';
// import {
//   createEdimCommandPlugins,
//   EdimCommandView,
// } from 'prosemirror-preset-command';
import { createEdimMenubarPlugins } from 'prosemirror-preset-menubar';

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

import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { faker } from '@faker-js/faker';

import {
  EDIM_DOC_NODES,
  EDIM_TEXT_NODES,
  edimCorePlugins,
} from '@edim-editor/core';
import { EDIM_HEADING_NODES, edimHeadingPlugins } from '@edim-editor/heading';
import {
  edimParagraphPlugins,
  EDIM_PARAGRAPH_NODES,
} from '@edim-editor/paragraph';
import {
  EDIM_BULLET_FREE_LIST_NODES,
  EDIM_FREE_LIST_ITEM_NODES,
  EDIM_ORDERED_FREE_LIST_NODES,
  edimFlatListPlugins,
} from '@edim-editor/flat-list';
import {
  EDIM_FLAT_TASK_LIST_NODES,
  EDIM_FLAT_TASK_LIST_ITEM_NODES,
  edimFlatTaskListPlugins,
} from '@edim-editor/flat-task-list';
import {
  EDIM_HORIZONTAL_RULE_NODES,
  edimHorizontalRulePlugins,
} from '@edim-editor/hr';
import {
  EDIM_IMAGE_NODES,
  edimImagePlugins,
  EdimImagePlaceholderViewProvider,
} from '@edim-editor/image';
// import {
//   EDIM_MENTION_MARK,
//   createEdimMentionPlugins,
//   MentionItem,
//   EdimMentionView,
// } from '@edim-editor/mention';
import { EDIM_LINK_MARKS } from '@edim-editor/link';
import { EDIM_BOLD_MARKS, edimBoldPlugins } from '@edim-editor/bold';
import { EDIM_CODE_MARKS, edimCodePlugins } from '@edim-editor/code';
import { EDIM_FONT_FAMILY_MARKS } from '@edim-editor/font-family';
import { EDIM_ITALIC_MARKS, edimItalicPlugins } from '@edim-editor/italic';
import {
  EDIM_STRIKETHROUGH_MARKS,
  createEdimStrikethroughPlugins,
} from '@edim-editor/strikethrough';
import {
  EDIM_SUBSCRIPT_MARKS,
  edimSubscriptPlugins,
} from '@edim-editor/subscript';
import {
  EDIM_SUPERSCRIPT_MARKS,
  edimSuperscriptPlugins,
} from '@edim-editor/superscript';
import { EDIM_TEXT_COLOR_MARKS } from '@edim-editor/text-color';
import {
  EDIM_UNDERLINE_MARKS,
  edimUnderlinePlugins,
} from '@edim-editor/underline';
import {
  EDIM_BLOCKQUOTE_NODES,
  edimBlockQuotePlugins,
} from '@edim-editor/blockquote';
import {
  EDIM_CODE_BLOCK_NODES,
  edimCodeBlockPlugins,
} from '@edim-editor/codeblock';
import {
  EDIM_TABLE_NODES,
  edimTableEditingPlugins,
  edimTablePlugins,
} from '@edim-editor/tables';
// import { EDIM_EMOJI_NODE } from '@edim-editor/emoji';
// import {
//   createEdimCommandPlugins,
//   EdimCommandView,
// } from '@edim-editor/command';
import { edimMenubarPlugins } from '@edim-editor/menubar';

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
  ...edimParagraphPlugins({
    nodeType: maximumSchema.nodes['paragraph'],
  }),
  ...edimFlatListPlugins({
    orderListNodeType: maximumSchema.nodes['ordered_list'],
    bulletListNodeType: maximumSchema.nodes['bullet_list'],
    listItemNodeType: maximumSchema.nodes['list_item'],
  }),
  ...edimFlatTaskListPlugins({
    taskListNodeType: maximumSchema.nodes['task_list'],
    taskListItemNodeType: maximumSchema.nodes['task_list_item'],
  }),
  ...edimBlockQuotePlugins({
    nodeType: maximumSchema.nodes['blockquote'],
    mergeAdjacentBlockquote: true,
  }),
  ...edimHorizontalRulePlugins({
    nodeType: maximumSchema.nodes['horizontal_rule'],
  }),
  ...edimHeadingPlugins({
    nodeType: maximumSchema.nodes['heading'],
    level: 6,
  }),
  ...edimCodeBlockPlugins({
    nodeType: maximumSchema.nodes['code_block'],
  }),
  ...edimImagePlugins({
    placeholderViewProvider: () => new EdimImagePlaceholderViewProvider(),
  }),
  ...edimItalicPlugins({
    markType: maximumSchema.marks['em'],
  }),
  ...edimBoldPlugins({
    markType: maximumSchema.marks['strong'],
  }),
  ...edimCodePlugins({
    markType: maximumSchema.marks['code'],
  }),
  ...edimTablePlugins({}),
  ...edimTableEditingPlugins(),
  ...edimCorePlugins(),
  ...edimUnderlinePlugins({
    markType: maximumSchema.marks['underline'],
  }),
  ...createEdimStrikethroughPlugins({
    markType: maximumSchema.marks['strikethrough'],
  }),
  ...edimSubscriptPlugins({
    markType: maximumSchema.marks['subscript'],
  }),
  ...edimSuperscriptPlugins({
    markType: maximumSchema.marks['superscript'],
  }),
  ...edimMenubarPlugins(),
];

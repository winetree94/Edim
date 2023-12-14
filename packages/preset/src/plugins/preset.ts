import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimCorePlugins } from '@edim-editor/core';
import {
  EDIM_HEADING_DEFAULT_NODE_NAME,
  edimHeadingPlugins,
} from '@edim-editor/heading';
import {
  EDIM_PARAGRAPH_DEFAULT_NODE_NAME,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';
import {
  EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME,
  EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME,
  EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME,
  edimFlatListPlugins,
} from '@edim-editor/flat-list';
import {
  EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME,
  EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME,
  edimFlatTaskListPlugins,
} from '@edim-editor/flat-task-list';
import {
  EDIM_HORIZONTAL_RULE_NODE_NAME,
  edimHorizontalRulePlugins,
} from '@edim-editor/hr';
import { EDIM_BOLD_MARK_NAME, edimBoldPlugins } from '@edim-editor/bold';
import { EDIM_CODE_MARK_NAME, edimCodePlugins } from '@edim-editor/code';
import { EDIM_ITALIC_MARK_NAME, edimItalicPlugins } from '@edim-editor/italic';
import {
  EDIM_STRIKETHROUGH_MARK_NAME,
  edimStrikethroughPlugins,
} from '@edim-editor/strikethrough';
import {
  EDIM_SUBSCRIPT_MARK_NAME,
  edimSubscriptPlugins,
} from '@edim-editor/subscript';
import {
  EDIM_SUPERSCRIPT_MARK_NAME,
  edimSuperscriptPlugins,
} from '@edim-editor/superscript';
import {
  EDIM_UNDERLINE_MARK_NAME,
  edimUnderlinePlugins,
} from '@edim-editor/underline';
import {
  EDIM_BLOCKQUOTE_NODE_NAME,
  edimBlockQuotePlugins,
} from '@edim-editor/blockquote';
import {
  EDIM_CODEBLOCK_NODE_NAME,
  edimCodeBlockPlugins,
} from '@edim-editor/codeblock';
import { edimTableEditingPlugins, edimTablePlugins } from '@edim-editor/tables';
import { edimMenubarPlugins } from '@edim-editor/menubar';
import { Schema } from 'prosemirror-model';

export interface EdimPresetPluginConfigs {
  schema: Schema;
}

export const edimPresetPlugins = (
  configs: EdimPresetPluginConfigs,
): PMPlugin[] => [
  ...edimParagraphPlugins({
    nodeType: configs.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
  }),
  ...edimHeadingPlugins({
    nodeType: configs.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
  }),
  ...edimFlatListPlugins({
    bulletListNodeType:
      configs.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
    orderListNodeType:
      configs.schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME],
    listItemNodeType:
      configs.schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
  }),
  ...edimFlatTaskListPlugins({
    taskListNodeType:
      configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
    taskListItemNodeType:
      configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME],
  }),
  ...edimBlockQuotePlugins({
    nodeType: configs.schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
  }),
  ...edimHorizontalRulePlugins({
    nodeType: configs.schema.nodes[EDIM_HORIZONTAL_RULE_NODE_NAME],
  }),
  ...edimCodeBlockPlugins({
    nodeType: configs.schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
  }),
  ...edimTablePlugins(),
  ...edimTableEditingPlugins(),
  ...edimItalicPlugins({
    markType: configs.schema.marks[EDIM_ITALIC_MARK_NAME],
  }),
  ...edimBoldPlugins({
    markType: configs.schema.marks[EDIM_BOLD_MARK_NAME],
  }),
  ...edimCodePlugins({
    markType: configs.schema.marks[EDIM_CODE_MARK_NAME],
  }),
  ...edimUnderlinePlugins({
    markType: configs.schema.marks[EDIM_UNDERLINE_MARK_NAME],
  }),
  ...edimStrikethroughPlugins({
    markType: configs.schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
  }),
  ...edimSubscriptPlugins({
    markType: configs.schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
  }),
  ...edimSuperscriptPlugins({
    markType: configs.schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
  }),
  ...edimMenubarPlugins(),
  ...edimCorePlugins(),
];

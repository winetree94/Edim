import { Plugin } from 'prosemirror-state';
import { edimCorePlugins } from '@edim-editor/core';
import { edimHeadingPlugins } from '@edim-editor/heading';
import { edimParagraphPlugins } from '@edim-editor/paragraph';
import { edimFlatListPlugins } from '@edim-editor/flat-list';
import { edimFlatTaskListPlugins } from '@edim-editor/flat-task-list';
import { edimHorizontalRulePlugins } from '@edim-editor/hr';
import { edimBoldPlugins } from '@edim-editor/bold';
import { edimCodePlugins } from '@edim-editor/code';
import { edimItalicPlugins } from '@edim-editor/italic';
import { createEdimStrikethroughPlugins } from '@edim-editor/strikethrough';
import { edimSubscriptPlugins } from '@edim-editor/subscript';
import { edimSuperscriptPlugins } from '@edim-editor/superscript';
import { edimUnderlinePlugins } from '@edim-editor/underline';
import { edimBlockQuotePlugins } from '@edim-editor/blockquote';
import { edimCodeBlockPlugins } from '@edim-editor/codeblock';
import { edimTableEditingPlugins, edimTablePlugins } from '../../../_wip_tables/src';
import { edimMenubarPlugins } from '@edim-editor/menubar';
import { EDIM_PRESET_SCHEMA } from '../schemas';

export const edimPresetPlugins = (): Plugin[] => [
  ...edimParagraphPlugins({
    nodeType: EDIM_PRESET_SCHEMA.nodes['paragraph'],
  }),
  ...edimFlatListPlugins({
    orderListNodeType: EDIM_PRESET_SCHEMA.nodes['ordered_list'],
    bulletListNodeType: EDIM_PRESET_SCHEMA.nodes['bullet_list'],
    listItemNodeType: EDIM_PRESET_SCHEMA.nodes['list_item'],
  }),
  ...edimFlatTaskListPlugins({
    taskListNodeType: EDIM_PRESET_SCHEMA.nodes['task_list'],
    taskListItemNodeType: EDIM_PRESET_SCHEMA.nodes['task_list_item'],
  }),
  ...edimBlockQuotePlugins({
    nodeType: EDIM_PRESET_SCHEMA.nodes['blockquote'],
    mergeAdjacentBlockquote: true,
  }),
  ...edimHorizontalRulePlugins({
    nodeType: EDIM_PRESET_SCHEMA.nodes['horizontal_rule'],
  }),
  ...edimHeadingPlugins({
    nodeType: EDIM_PRESET_SCHEMA.nodes['heading'],
    level: 6,
  }),
  ...edimCodeBlockPlugins({
    nodeType: EDIM_PRESET_SCHEMA.nodes['code_block'],
  }),
  ...edimItalicPlugins({
    markType: EDIM_PRESET_SCHEMA.marks['em'],
  }),
  ...edimBoldPlugins({
    markType: EDIM_PRESET_SCHEMA.marks['strong'],
  }),
  ...edimCodePlugins({
    markType: EDIM_PRESET_SCHEMA.marks['code'],
  }),
  ...edimTablePlugins({}),
  ...edimTableEditingPlugins(),
  ...edimCorePlugins(),
  ...edimUnderlinePlugins({
    markType: EDIM_PRESET_SCHEMA.marks['underline'],
  }),
  ...createEdimStrikethroughPlugins({
    markType: EDIM_PRESET_SCHEMA.marks['strikethrough'],
  }),
  ...edimSubscriptPlugins({
    markType: EDIM_PRESET_SCHEMA.marks['subscript'],
  }),
  ...edimSuperscriptPlugins({
    markType: EDIM_PRESET_SCHEMA.marks['superscript'],
  }),
  ...edimMenubarPlugins(),
];

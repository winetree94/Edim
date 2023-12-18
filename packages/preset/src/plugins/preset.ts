import { Plugin as PMPlugin, Plugin } from 'prosemirror-state';
import { edimCorePlugins } from '@edim-editor/core';
import {
  EDIM_HEADING_DEFAULT_NODE_NAME,
  EdimHeadingPluginConfigs,
  edimHeadingPlugins,
} from '@edim-editor/heading';
import {
  EDIM_PARAGRAPH_DEFAULT_NODE_NAME,
  EdimParagraphPluginConfigs,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';
import {
  EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME,
  EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME,
  EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME,
  EdimFlatListPluginConfigs,
  edimFlatListPlugins,
} from '@edim-editor/flat-list';
import {
  EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME,
  EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME,
  EdimFlatTaskListPluginConfigs,
  edimFlatTaskListPlugins,
} from '@edim-editor/flat-task-list';
import {
  EDIM_HORIZONTAL_RULE_NODE_NAME,
  EdimHorizontalRulePluginConfigs,
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
  EdimBlockQuotePluginConfigs,
  edimBlockQuotePlugins,
} from '@edim-editor/blockquote';
import {
  EDIM_CODEBLOCK_NODE_NAME,
  EdimCodeBlockPluginConfigs,
  edimCodeBlockPlugins,
} from '@edim-editor/codeblock';
import {
  EDIM_TABLE_CELL_DEFAULT_NODE_NAME,
  EDIM_TABLE_DEFAULT_NODE_NAME,
  EDIM_TABLE_ROW_DEFAULT_NODE_NAME,
  EdimTablePluginConfigs,
  edimTableEditingPlugins,
  edimTablePlugins,
} from '@edim-editor/tables';
import { edimMenubarPlugins } from '@edim-editor/menubar';
import { Schema } from 'prosemirror-model';
import { EDIM_FONT_FAMILY_DEFAULT_MARK_NAME } from '@edim-editor/font-family';
import { EDIM_LINK_DEFAULT_MARK_NAME } from '@edim-editor/link';

export interface EdimPresetPluginConfigs {
  schema: Schema;
  paragraph?: EdimParagraphPluginConfigs;
  heading?: EdimHeadingPluginConfigs;
  flatList?: EdimFlatListPluginConfigs;
  flatTaskList?: EdimFlatTaskListPluginConfigs;
  blockquote?: EdimBlockQuotePluginConfigs;
  hr?: EdimHorizontalRulePluginConfigs;
  codeblock?: EdimCodeBlockPluginConfigs;
  table?: EdimTablePluginConfigs;
}

export const edimPresetPlugins = (
  configs: EdimPresetPluginConfigs,
): PMPlugin[] => {
  const plugins: Plugin[] = [
    ...edimParagraphPlugins({
      nodeType: configs.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
    }),
    ...edimHeadingPlugins({
      nodeType: configs.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
    }),
    ...edimFlatListPlugins({
      bulletListNodeType:
        configs.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
      orderedListNodeType:
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
    ...edimTablePlugins({
      tableNodeType: configs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      tableRowNodeType: configs.schema.nodes[EDIM_TABLE_ROW_DEFAULT_NODE_NAME],
      tableCellNodeType:
        configs.schema.nodes[EDIM_TABLE_CELL_DEFAULT_NODE_NAME],
    }),
    ...edimTableEditingPlugins({
      tableNodeType: configs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      tableRowNodeType: configs.schema.nodes[EDIM_TABLE_ROW_DEFAULT_NODE_NAME],
      tableCellNodeType:
        configs.schema.nodes[EDIM_TABLE_CELL_DEFAULT_NODE_NAME],
    }),
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
    ...edimMenubarPlugins({
      textType: {
        paragraphNodeType:
          configs.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
        headingNodeType: configs.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
        headingLevels: [1, 2, 3, 4, 5, 6],
      },
      fontFamily: {
        fontFamilyMarkType:
          configs.schema.marks[EDIM_FONT_FAMILY_DEFAULT_MARK_NAME],
      },
      textStyles: {
        boldMarkType: configs.schema.marks[EDIM_BOLD_MARK_NAME],
        italicMarkType: configs.schema.marks[EDIM_ITALIC_MARK_NAME],
        underlineMarkType: configs.schema.marks[EDIM_UNDERLINE_MARK_NAME],
        strikethroughMarkType:
          configs.schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
        codeMarkType: configs.schema.marks[EDIM_CODE_MARK_NAME],
        subscriptMarkType: configs.schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
        superscriptMarkType: configs.schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
        useClearBUtton: true,
      },
      textColor: {
        textColorMarkType:
          configs.schema.marks[EDIM_FONT_FAMILY_DEFAULT_MARK_NAME],
      },
      align: {},
      list: {
        flatOrderedListNodeType:
          configs.schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME],
        flatBulletListNodeType:
          configs.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
        flatListItemNodeType:
          configs.schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
      },
      taskList: {
        flatTaskListNodeType:
          configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
        flatTaskListItemNodeType:
          configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME],
      },
      blockquote: {
        blockQuoteNodeType: configs.schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
      },
      codeblock: {
        codeBlockNodeType: configs.schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
      },
      table: {
        tableNodeType: configs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      },
      link: {
        linkMarkType: configs.schema.marks[EDIM_LINK_DEFAULT_MARK_NAME],
      },
    }),
    ...edimCorePlugins(),
  ];

  return plugins;
};

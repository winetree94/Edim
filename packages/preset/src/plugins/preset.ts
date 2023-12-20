import { Plugin as PMPlugin, Plugin } from 'prosemirror-state';
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
import {
  EDIM_TABLE_CELL_DEFAULT_NODE_NAME,
  EDIM_TABLE_DEFAULT_NODE_NAME,
  EDIM_TABLE_ROW_DEFAULT_NODE_NAME,
  edimTableEditingPlugins,
  edimTablePlugins,
} from '@edim-editor/tables';
import { edimMenubarPlugins } from '@edim-editor/menubar';
import { Schema } from 'prosemirror-model';
import { EDIM_FONT_FAMILY_DEFAULT_MARK_NAME } from '@edim-editor/font-family';
import { EDIM_LINK_DEFAULT_MARK_NAME } from '@edim-editor/link';
import { EDIM_TEXT_COLOR_DEFAULT_MARK_NAME } from '@edim-editor/text-color';

/**
 * @see https://edim.me/docs/packages/menubar
 */
export interface EdimPresetPluginConfigs {
  /**
   * preset schema
   * @requires
   */
  schema: Schema;

  /**
   * @default true
   */
  menubar?: boolean;
}

const DEFAULT_CONFIGS: Required<Omit<EdimPresetPluginConfigs, 'schema'>> = {
  menubar: true,
};

export const edimPresetPlugins = (
  configs: EdimPresetPluginConfigs,
): PMPlugin[] => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const plugins: Plugin[] = [
    ...edimParagraphPlugins({
      nodeType: mergedConfigs.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
    }),
    ...edimHeadingPlugins({
      nodeType: mergedConfigs.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
    }),
    ...edimFlatListPlugins({
      bulletListNodeType:
        mergedConfigs.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
      orderedListNodeType:
        mergedConfigs.schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME],
      listItemNodeType:
        mergedConfigs.schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
    }),
    ...edimFlatTaskListPlugins({
      taskListNodeType:
        mergedConfigs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
      taskListItemNodeType:
        mergedConfigs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME],
    }),
    ...edimBlockQuotePlugins({
      nodeType: mergedConfigs.schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
    }),
    ...edimHorizontalRulePlugins({
      nodeType: mergedConfigs.schema.nodes[EDIM_HORIZONTAL_RULE_NODE_NAME],
    }),
    ...edimCodeBlockPlugins({
      nodeType: mergedConfigs.schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
    }),
    ...edimTablePlugins({
      tableNodeType: mergedConfigs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      tableRowNodeType:
        mergedConfigs.schema.nodes[EDIM_TABLE_ROW_DEFAULT_NODE_NAME],
      tableCellNodeType:
        mergedConfigs.schema.nodes[EDIM_TABLE_CELL_DEFAULT_NODE_NAME],
    }),
    ...edimTableEditingPlugins({
      tableNodeType: mergedConfigs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      tableRowNodeType:
        mergedConfigs.schema.nodes[EDIM_TABLE_ROW_DEFAULT_NODE_NAME],
      tableCellNodeType:
        mergedConfigs.schema.nodes[EDIM_TABLE_CELL_DEFAULT_NODE_NAME],
    }),
    ...edimItalicPlugins({
      markType: mergedConfigs.schema.marks[EDIM_ITALIC_MARK_NAME],
    }),
    ...edimBoldPlugins({
      markType: mergedConfigs.schema.marks[EDIM_BOLD_MARK_NAME],
    }),
    ...edimCodePlugins({
      markType: mergedConfigs.schema.marks[EDIM_CODE_MARK_NAME],
    }),
    ...edimUnderlinePlugins({
      markType: mergedConfigs.schema.marks[EDIM_UNDERLINE_MARK_NAME],
    }),
    ...edimStrikethroughPlugins({
      markType: mergedConfigs.schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
    }),
    ...edimSubscriptPlugins({
      markType: mergedConfigs.schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
    }),
    ...edimSuperscriptPlugins({
      markType: mergedConfigs.schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
    }),
    ...edimCorePlugins(),
  ];

  if (mergedConfigs.menubar) {
    plugins.push(
      ...edimMenubarPlugins({
        textType: {
          paragraphNodeType:
            mergedConfigs.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
          headingNodeType:
            mergedConfigs.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
        },
        fontFamily: {
          fontFamilyMarkType:
            mergedConfigs.schema.marks[EDIM_FONT_FAMILY_DEFAULT_MARK_NAME],
        },
        textStyles: {
          boldMarkType: mergedConfigs.schema.marks[EDIM_BOLD_MARK_NAME],
          italicMarkType: mergedConfigs.schema.marks[EDIM_ITALIC_MARK_NAME],
          underlineMarkType:
            mergedConfigs.schema.marks[EDIM_UNDERLINE_MARK_NAME],
          strikethroughMarkType:
            mergedConfigs.schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
          codeMarkType: mergedConfigs.schema.marks[EDIM_CODE_MARK_NAME],
          subscriptMarkType:
            mergedConfigs.schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
          superscriptMarkType:
            mergedConfigs.schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
          useClearButton: true,
        },
        textColor: {
          textColorMarkType:
            mergedConfigs.schema.marks[EDIM_TEXT_COLOR_DEFAULT_MARK_NAME],
        },
        align: {},
        list: {
          orderedListNodeType:
            mergedConfigs.schema.nodes[
              EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME
            ],
          bulletListNodeType:
            mergedConfigs.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
          listItemNodeType:
            mergedConfigs.schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
        },
        taskList: {
          taskListNodeType:
            mergedConfigs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
          taskListItemNodeType:
            mergedConfigs.schema.nodes[
              EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME
            ],
        },
        blockquote: {
          blockQuoteNodeType:
            mergedConfigs.schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
        },
        codeblock: {
          codeBlockNodeType:
            mergedConfigs.schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
        },
        table: {
          tableNodeType:
            mergedConfigs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
        },
        link: {
          linkMarkType: mergedConfigs.schema.marks[EDIM_LINK_DEFAULT_MARK_NAME],
        },
      }),
    );
  }

  return plugins;
};

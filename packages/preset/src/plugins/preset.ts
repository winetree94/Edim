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
  const _configs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const plugins: Plugin[] = [
    ...edimParagraphPlugins({
      nodeType: _configs.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
    }),
    ...edimHeadingPlugins({
      nodeType: _configs.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
    }),
    ...edimFlatListPlugins({
      bulletListNodeType:
        _configs.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
      orderedListNodeType:
        _configs.schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME],
      listItemNodeType:
        _configs.schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
    }),
    ...edimFlatTaskListPlugins({
      taskListNodeType:
        _configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
      taskListItemNodeType:
        _configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME],
    }),
    ...edimBlockQuotePlugins({
      nodeType: _configs.schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
    }),
    ...edimHorizontalRulePlugins({
      nodeType: _configs.schema.nodes[EDIM_HORIZONTAL_RULE_NODE_NAME],
    }),
    ...edimCodeBlockPlugins({
      nodeType: _configs.schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
    }),
    ...edimTablePlugins({
      tableNodeType: _configs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      tableRowNodeType: _configs.schema.nodes[EDIM_TABLE_ROW_DEFAULT_NODE_NAME],
      tableCellNodeType:
        _configs.schema.nodes[EDIM_TABLE_CELL_DEFAULT_NODE_NAME],
    }),
    ...edimTableEditingPlugins({
      tableNodeType: _configs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      tableRowNodeType: _configs.schema.nodes[EDIM_TABLE_ROW_DEFAULT_NODE_NAME],
      tableCellNodeType:
        _configs.schema.nodes[EDIM_TABLE_CELL_DEFAULT_NODE_NAME],
    }),
    ...edimItalicPlugins({
      markType: _configs.schema.marks[EDIM_ITALIC_MARK_NAME],
    }),
    ...edimBoldPlugins({
      markType: _configs.schema.marks[EDIM_BOLD_MARK_NAME],
    }),
    ...edimCodePlugins({
      markType: _configs.schema.marks[EDIM_CODE_MARK_NAME],
    }),
    ...edimUnderlinePlugins({
      markType: _configs.schema.marks[EDIM_UNDERLINE_MARK_NAME],
    }),
    ...edimStrikethroughPlugins({
      markType: _configs.schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
    }),
    ...edimSubscriptPlugins({
      markType: _configs.schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
    }),
    ...edimSuperscriptPlugins({
      markType: _configs.schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
    }),
    ...edimCorePlugins(),
  ];

  if (_configs.menubar) {
    plugins.push(
      ...edimMenubarPlugins({
        textType: {
          paragraphNodeType:
            _configs.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
          headingNodeType:
            _configs.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
        },
        fontFamily: {
          fontFamilyMarkType:
            _configs.schema.marks[EDIM_FONT_FAMILY_DEFAULT_MARK_NAME],
        },
        textStyles: {
          boldMarkType: _configs.schema.marks[EDIM_BOLD_MARK_NAME],
          italicMarkType: _configs.schema.marks[EDIM_ITALIC_MARK_NAME],
          underlineMarkType: _configs.schema.marks[EDIM_UNDERLINE_MARK_NAME],
          strikethroughMarkType:
            _configs.schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
          codeMarkType: _configs.schema.marks[EDIM_CODE_MARK_NAME],
          subscriptMarkType: _configs.schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
          superscriptMarkType:
            _configs.schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
          useClearButton: true,
        },
        textColor: {
          textColorMarkType:
            _configs.schema.marks[EDIM_FONT_FAMILY_DEFAULT_MARK_NAME],
        },
        align: {},
        list: {
          orderedListNodeType:
            _configs.schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME],
          bulletListNodeType:
            _configs.schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
          listItemNodeType:
            _configs.schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
        },
        taskList: {
          taskListNodeType:
            _configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
          taskListItemNodeType:
            _configs.schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME],
        },
        blockquote: {
          blockQuoteNodeType: _configs.schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
        },
        codeblock: {
          codeBlockNodeType: _configs.schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
        },
        table: {
          tableNodeType: _configs.schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
        },
        link: {
          linkMarkType: _configs.schema.marks[EDIM_LINK_DEFAULT_MARK_NAME],
        },
      }),
    );
  }

  return plugins;
};

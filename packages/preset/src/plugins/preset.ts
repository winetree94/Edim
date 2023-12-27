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
import {
  EDIM_BOLD_MARK_NAME,
  EdimBoldPluginConfigs,
  edimBoldPlugins,
} from '@edim-editor/bold';
import {
  EDIM_CODE_MARK_NAME,
  EdimCodePluginConfigs,
  edimCodePlugins,
} from '@edim-editor/code';
import {
  EDIM_ITALIC_MARK_NAME,
  EdimItalicPluginConfigs,
  edimItalicPlugins,
} from '@edim-editor/italic';
import {
  EDIM_STRIKETHROUGH_MARK_NAME,
  EdimStrikethroughPluginConfigs,
  edimStrikethroughPlugins,
} from '@edim-editor/strikethrough';
import {
  EDIM_SUBSCRIPT_MARK_NAME,
  EdimSubscriptPluginConfigs,
  edimSubscriptPlugins,
} from '@edim-editor/subscript';
import {
  EDIM_SUPERSCRIPT_MARK_NAME,
  EdimSuperscriptPluginConfigs,
  edimSuperscriptPlugins,
} from '@edim-editor/superscript';
import {
  EDIM_UNDERLINE_MARK_NAME,
  EdimUnderlinePluginConfigs,
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
  EdimTableEditingPluginConfigs,
  edimTableEditingPlugins,
  edimTablePlugins,
} from '@edim-editor/tables';
import {
  EdimMenubarPluginConfigs,
  edimMenubarPlugins,
} from '@edim-editor/menubar';
import { Schema } from 'prosemirror-model';
import { EDIM_FONT_FAMILY_DEFAULT_MARK_NAME } from '@edim-editor/font-family';
import {
  EDIM_LINK_DEFAULT_MARK_NAME,
  EdimLinkPluginConfigs,
  edimLinkPlugins,
} from '@edim-editor/link';
import {
  EDIM_MENTION_DEFAULT_MARK_NAME,
  EdimMentionPluginConfigs,
  edimMentionPlugins,
} from '@edim-editor/mention';
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

  paragraph?: EdimParagraphPluginConfigs | null;
  heading?: EdimHeadingPluginConfigs | null;
  flatTaskList?: EdimFlatTaskListPluginConfigs | null;
  flatList?: EdimFlatListPluginConfigs | null;
  blockquote?: EdimBlockQuotePluginConfigs | null;
  horizontalRule?: EdimHorizontalRulePluginConfigs | null;
  codeblock?: EdimCodeBlockPluginConfigs | null;
  table?: EdimTableEditingPluginConfigs | null;

  italic?: EdimItalicPluginConfigs | null;
  bold?: EdimBoldPluginConfigs | null;
  code?: EdimCodePluginConfigs | null;
  underline?: EdimUnderlinePluginConfigs | null;
  strikethrough?: EdimStrikethroughPluginConfigs | null;
  subscript?: EdimSubscriptPluginConfigs | null;
  superscript?: EdimSuperscriptPluginConfigs | null;
  link?: EdimLinkPluginConfigs | null;
  mention?: EdimMentionPluginConfigs | null;

  /**
   * @default true
   */
  menubar?: EdimMenubarPluginConfigs | null;
}

const getDefaultConfigs = (
  schema: Schema,
): Required<Omit<EdimPresetPluginConfigs, 'schema'>> => {
  return {
    paragraph: {
      nodeType: schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
    },
    heading: {
      nodeType: schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
    },
    flatTaskList: {
      taskListNodeType: schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
      taskListItemNodeType:
        schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME],
    },
    flatList: {
      bulletListNodeType: schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
      orderedListNodeType:
        schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME],
      listItemNodeType: schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
    },
    blockquote: {
      nodeType: schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
    },
    horizontalRule: {
      nodeType: schema.nodes[EDIM_HORIZONTAL_RULE_NODE_NAME],
    },
    codeblock: {
      nodeType: schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
    },
    table: {
      tableNodeType: schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      tableRowNodeType: schema.nodes[EDIM_TABLE_ROW_DEFAULT_NODE_NAME],
      tableCellNodeType: schema.nodes[EDIM_TABLE_CELL_DEFAULT_NODE_NAME],
    },
    italic: {
      markType: schema.marks[EDIM_ITALIC_MARK_NAME],
    },
    bold: {
      markType: schema.marks[EDIM_BOLD_MARK_NAME],
    },
    code: {
      markType: schema.marks[EDIM_CODE_MARK_NAME],
    },
    underline: {
      markType: schema.marks[EDIM_UNDERLINE_MARK_NAME],
    },
    strikethrough: {
      markType: schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
    },
    subscript: {
      markType: schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
    },
    superscript: {
      markType: schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
    },
    link: {
      markType: schema.marks[EDIM_LINK_DEFAULT_MARK_NAME],
    },
    mention: {
      markType: schema.marks[EDIM_MENTION_DEFAULT_MARK_NAME],
    },
    menubar: {
      textType: {
        paragraphNodeType: schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME],
        headingNodeType: schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME],
      },
      fontFamily: {
        fontFamilyMarkType: schema.marks[EDIM_FONT_FAMILY_DEFAULT_MARK_NAME],
      },
      textStyles: {
        boldMarkType: schema.marks[EDIM_BOLD_MARK_NAME],
        italicMarkType: schema.marks[EDIM_ITALIC_MARK_NAME],
        underlineMarkType: schema.marks[EDIM_UNDERLINE_MARK_NAME],
        strikethroughMarkType: schema.marks[EDIM_STRIKETHROUGH_MARK_NAME],
        codeMarkType: schema.marks[EDIM_CODE_MARK_NAME],
        subscriptMarkType: schema.marks[EDIM_SUBSCRIPT_MARK_NAME],
        superscriptMarkType: schema.marks[EDIM_SUPERSCRIPT_MARK_NAME],
        useClearButton: true,
      },
      textColor: {
        textColorMarkType: schema.marks[EDIM_TEXT_COLOR_DEFAULT_MARK_NAME],
      },
      align: {},
      list: {
        orderedListNodeType:
          schema.nodes[EDIM_FLAT_ORDERED_LIST_DEFAULT_NODE_NAME],
        bulletListNodeType:
          schema.nodes[EDIM_FLAT_BULLET_LIST_DEFAULT_NODE_NAME],
        listItemNodeType: schema.nodes[EDIM_FLAT_LIST_ITEM_DEFAULT_NODE_NAME],
      },
      taskList: {
        taskListNodeType: schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_NODE_NAME],
        taskListItemNodeType:
          schema.nodes[EDIM_DEFAULT_FLAT_TASK_LIST_ITEM_NODE_NAME],
      },
      blockquote: {
        blockQuoteNodeType: schema.nodes[EDIM_BLOCKQUOTE_NODE_NAME],
      },
      codeblock: {
        codeBlockNodeType: schema.nodes[EDIM_CODEBLOCK_NODE_NAME],
      },
      table: {
        tableNodeType: schema.nodes[EDIM_TABLE_DEFAULT_NODE_NAME],
      },
      link: {
        linkMarkType: schema.marks[EDIM_LINK_DEFAULT_MARK_NAME],
      },
      mention: {
        mentionMarkType: schema.marks[EDIM_MENTION_DEFAULT_MARK_NAME],
      },
    },
  };
};

export const edimPresetPlugins = (
  configs: EdimPresetPluginConfigs,
): PMPlugin[] => {
  const plugins: Plugin[] = [];
  const mergedConfigs = {
    ...getDefaultConfigs(configs.schema),
    ...configs,
  };

  if (mergedConfigs.paragraph) {
    plugins.push(...edimParagraphPlugins(mergedConfigs.paragraph));
  }

  if (mergedConfigs.heading) {
    plugins.push(...edimHeadingPlugins(mergedConfigs.heading));
  }

  if (mergedConfigs.flatTaskList) {
    plugins.push(...edimFlatTaskListPlugins(mergedConfigs.flatTaskList));
  }

  if (mergedConfigs.flatList) {
    plugins.push(...edimFlatListPlugins(mergedConfigs.flatList));
  }

  if (mergedConfigs.blockquote) {
    plugins.push(...edimBlockQuotePlugins(mergedConfigs.blockquote));
  }

  if (mergedConfigs.horizontalRule) {
    plugins.push(...edimHorizontalRulePlugins(mergedConfigs.horizontalRule));
  }

  if (mergedConfigs.codeblock) {
    plugins.push(...edimCodeBlockPlugins(mergedConfigs.codeblock));
  }

  if (mergedConfigs.table) {
    plugins.push(...edimTablePlugins(mergedConfigs.table));
    plugins.push(...edimTableEditingPlugins(mergedConfigs.table));
  }

  if (mergedConfigs.italic) {
    plugins.push(...edimItalicPlugins(mergedConfigs.italic));
  }

  if (mergedConfigs.bold) {
    plugins.push(...edimBoldPlugins(mergedConfigs.bold));
  }

  if (mergedConfigs.code) {
    plugins.push(...edimCodePlugins(mergedConfigs.code));
  }

  if (mergedConfigs.underline) {
    plugins.push(...edimUnderlinePlugins(mergedConfigs.underline));
  }

  if (mergedConfigs.strikethrough) {
    plugins.push(...edimStrikethroughPlugins(mergedConfigs.strikethrough));
  }

  if (mergedConfigs.subscript) {
    plugins.push(...edimSubscriptPlugins(mergedConfigs.subscript));
  }

  if (mergedConfigs.superscript) {
    plugins.push(...edimSuperscriptPlugins(mergedConfigs.superscript));
  }

  if (mergedConfigs.link) {
    plugins.push(...edimLinkPlugins(mergedConfigs.link));
  }

  if (mergedConfigs.mention) {
    plugins.push(...edimMentionPlugins(mergedConfigs.mention));
  }

  if (mergedConfigs.menubar) {
    plugins.push(...edimMenubarPlugins(mergedConfigs.menubar));
  }

  plugins.push(...edimCorePlugins());

  return plugins;
};

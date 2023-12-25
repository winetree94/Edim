import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import { edimBaseNodes } from '@edim-editor/core';
import { EdimHeadingNodeConfigs, edimHeadingNodes } from '@edim-editor/heading';
import {
  EdimParagraphNodeConfigs,
  edimParagraphNodes,
} from '@edim-editor/paragraph';
import {
  EdimFlatBulletListNodeConfigs,
  EdimFlatListItemNodeConfigs,
  EdimFlatOrderedListNodeConfigs,
  edimFlatBulletListNodes,
  edimFlatListItemNodes,
  edimFlatOrderedListNodes,
} from '@edim-editor/flat-list';
import {
  edimFlatTaskListNodes,
  edimFlatTaskListItemNodes,
  EdimFlatTaskListNodeConfigs,
  EdimFlatTaskListItemNodeConfigs,
} from '@edim-editor/flat-task-list';
import {
  EdimHorizontalRuleNodeConfigs,
  edimHorizontalRuleNodes,
} from '@edim-editor/hr';
import { EdimLinkMarkConfigs, edimLinkMarks } from '@edim-editor/link';
import { EdimBoldMarkConfigs, edimBoldMarks } from '@edim-editor/bold';
import { EdimCodeMarkConfigs, edimCodeMarks } from '@edim-editor/code';
import {
  EdimFontFamilyMarkConfigs,
  edimFontFamilyMarks,
} from '@edim-editor/font-family';
import { EdimItalicMarkConfigs, edimItalicMarks } from '@edim-editor/italic';
import {
  EdimStrikethroughMarkConfigs,
  edimStrikethroughMarks,
} from '@edim-editor/strikethrough';
import {
  EdimSubscriptMarkConfigs,
  edimSubscriptMarks,
} from '@edim-editor/subscript';
import {
  EdimSuperscriptMarkConfigs,
  edimSuperscriptMarks,
} from '@edim-editor/superscript';
import {
  EdimTextColorMarkConfigs,
  edimTextColorMarks,
} from '@edim-editor/text-color';
import {
  EdimUnderlineMarkConfigs,
  edimUnderlineMarks,
} from '@edim-editor/underline';
import {
  EdimBlockquoteNodeConfigs,
  edimBlockquoteNodes,
} from '@edim-editor/blockquote';
import {
  EdimCodeBlockNodeConfigs,
  edimCodeBlockNodes,
} from '@edim-editor/codeblock';
import { EdimMentionMarkConfigs, edimMentionMarks } from '@edim-editor/mention';
import { EdimTableNodeConfigs, edimTableNodes } from '@edim-editor/tables';

export interface EdimPresetSchemaConfigs {
  paragraph?: EdimParagraphNodeConfigs | null;
  heading?: EdimHeadingNodeConfigs | null;
  flatTaskList?: EdimFlatTaskListNodeConfigs | null;
  flatTaskListItem?: EdimFlatTaskListItemNodeConfigs | null;
  flatBulletList?: EdimFlatBulletListNodeConfigs | null;
  flatOrderedList?: EdimFlatOrderedListNodeConfigs | null;
  flatListItem?: EdimFlatListItemNodeConfigs | null;
  blockquote?: EdimBlockquoteNodeConfigs | null;
  horizontalRule?: EdimHorizontalRuleNodeConfigs | null;
  codeblock?: EdimCodeBlockNodeConfigs | null;
  table?: EdimTableNodeConfigs | null;

  bold?: EdimBoldMarkConfigs | null;
  italic?: EdimItalicMarkConfigs | null;
  underline?: EdimUnderlineMarkConfigs | null;
  strikethrough?: EdimStrikethroughMarkConfigs | null;
  code?: EdimCodeMarkConfigs | null;
  subscript?: EdimSubscriptMarkConfigs | null;
  superscript?: EdimSuperscriptMarkConfigs | null;
  fontFamily?: EdimFontFamilyMarkConfigs | null;
  textColor?: EdimTextColorMarkConfigs | null;
  link?: EdimLinkMarkConfigs | null;
  mention?: EdimMentionMarkConfigs | null;
}

const DEFAULT_CONFIGS: Required<EdimPresetSchemaConfigs> = {
  // nodes
  paragraph: {},
  heading: {},
  flatTaskList: {},
  flatTaskListItem: {},
  flatBulletList: {},
  flatOrderedList: {},
  flatListItem: {},
  blockquote: {},
  horizontalRule: {},
  codeblock: {},
  table: {},

  // marks
  bold: {},
  italic: {},
  underline: {},
  strikethrough: {},
  code: {},
  subscript: {
    superscriptMarkName: 'superscript',
  },
  superscript: {
    subscriptMarkName: 'subscript',
  },
  fontFamily: {},
  textColor: {},
  link: {},
  mention: {},
};

export const edimPresetSchema = (configs?: EdimPresetSchemaConfigs) => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const spec: {
    nodes: Record<string, NodeSpec>;
    marks: Record<string, MarkSpec>;
  } = {
    nodes: {
      ...edimBaseNodes(),
    },
    marks: {},
  };

  if (mergedConfigs.paragraph) {
    spec.nodes = {
      ...spec.nodes,
      ...edimParagraphNodes(mergedConfigs.paragraph),
    };
  }

  if (mergedConfigs.heading) {
    spec.nodes = {
      ...spec.nodes,
      ...edimHeadingNodes(mergedConfigs.heading),
    };
  }

  if (mergedConfigs.flatTaskList) {
    spec.nodes = {
      ...spec.nodes,
      ...edimFlatTaskListNodes(mergedConfigs.flatTaskList),
    };
  }

  if (mergedConfigs.flatTaskListItem) {
    spec.nodes = {
      ...spec.nodes,
      ...edimFlatTaskListItemNodes(mergedConfigs.flatTaskListItem),
    };
  }

  if (mergedConfigs.flatBulletList) {
    spec.nodes = {
      ...spec.nodes,
      ...edimFlatBulletListNodes(mergedConfigs.flatBulletList),
    };
  }

  if (mergedConfigs.flatOrderedList) {
    spec.nodes = {
      ...spec.nodes,
      ...edimFlatOrderedListNodes(mergedConfigs.flatOrderedList),
    };
  }

  if (mergedConfigs.flatListItem) {
    spec.nodes = {
      ...spec.nodes,
      ...edimFlatListItemNodes(mergedConfigs.flatListItem),
    };
  }

  if (mergedConfigs.blockquote) {
    spec.nodes = {
      ...spec.nodes,
      ...edimBlockquoteNodes(mergedConfigs.blockquote),
    };
  }

  if (mergedConfigs.horizontalRule) {
    spec.nodes = {
      ...spec.nodes,
      ...edimHorizontalRuleNodes(mergedConfigs.horizontalRule),
    };
  }

  if (mergedConfigs.codeblock) {
    spec.nodes = {
      ...spec.nodes,
      ...edimCodeBlockNodes(mergedConfigs.codeblock),
    };
  }

  if (mergedConfigs.table) {
    spec.nodes = {
      ...spec.nodes,
      ...edimTableNodes(mergedConfigs.table),
    };
  }

  if (mergedConfigs.bold) {
    spec.marks = {
      ...spec.marks,
      ...edimBoldMarks(mergedConfigs.bold),
    };
  }

  if (mergedConfigs.italic) {
    spec.marks = {
      ...spec.marks,
      ...edimItalicMarks(mergedConfigs.italic),
    };
  }

  if (mergedConfigs.underline) {
    spec.marks = {
      ...spec.marks,
      ...edimUnderlineMarks(mergedConfigs.underline),
    };
  }

  if (mergedConfigs.strikethrough) {
    spec.marks = {
      ...spec.marks,
      ...edimStrikethroughMarks(mergedConfigs.strikethrough),
    };
  }

  if (mergedConfigs.code) {
    spec.marks = {
      ...spec.marks,
      ...edimCodeMarks(mergedConfigs.code),
    };
  }

  if (mergedConfigs.subscript) {
    spec.marks = {
      ...spec.marks,
      ...edimSubscriptMarks(mergedConfigs.subscript),
    };
  }

  if (mergedConfigs.superscript) {
    spec.marks = {
      ...spec.marks,
      ...edimSuperscriptMarks(mergedConfigs.superscript),
    };
  }

  if (mergedConfigs.fontFamily) {
    spec.marks = {
      ...spec.marks,
      ...edimFontFamilyMarks(mergedConfigs.fontFamily),
    };
  }

  if (mergedConfigs.textColor) {
    spec.marks = {
      ...spec.marks,
      ...edimTextColorMarks(mergedConfigs.textColor),
    };
  }

  if (mergedConfigs.link) {
    spec.marks = {
      ...spec.marks,
      ...edimLinkMarks(mergedConfigs.link),
    };
  }

  if (mergedConfigs.mention) {
    spec.marks = {
      ...spec.marks,
      ...edimMentionMarks(mergedConfigs.mention),
    };
  }

  return new Schema(spec);
};

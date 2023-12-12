import { Schema } from 'prosemirror-model';

import { edimBaseNodes } from '@edim-editor/core';
import { edimHeadingNodes } from '@edim-editor/heading';
import { edimParagraphNodes } from '@edim-editor/paragraph';
import {
  edimFlatBulletListNodes,
  edimFlatListItemNodes,
  edimFlatOrderedListNodes,
} from '@edim-editor/flat-list';
import {
  edimFlatTaskListNodes,
  edimFlatTaskListItemNodes,
} from '@edim-editor/flat-task-list';
import { edimHorizontalRuleNodes } from '@edim-editor/hr';
import { edimLinkMarks } from '@edim-editor/link';
import { edimBoldMarks } from '@edim-editor/bold';
import { edimCodeMarks } from '@edim-editor/code';
import { edimFontFamilyMarks } from '@edim-editor/font-family';
import { edimItalicMarks } from '@edim-editor/italic';
import { edimStrikeThroughMarks } from '@edim-editor/strikethrough';
import { edimSubscriptMarks } from '@edim-editor/subscript';
import { edimSuperscriptMarks } from '@edim-editor/superscript';
import { edimTextColorMarks } from '@edim-editor/text-color';
import { edimUnderlineMarks } from '@edim-editor/underline';
import { edimBlockquoteNodes } from '@edim-editor/blockquote';
import { edimCodeBlockNodes } from '@edim-editor/codeblock';
import { edimTableNodes } from '@edim-editor/tables';

export const edimPresetSchema = () =>
  new Schema({
    nodes: {
      ...edimBaseNodes(),
      ...edimParagraphNodes(),
      ...edimFlatBulletListNodes(),
      ...edimFlatOrderedListNodes(),
      ...edimFlatListItemNodes(),
      ...edimFlatTaskListNodes(),
      ...edimFlatTaskListItemNodes(),
      ...edimBlockquoteNodes(),
      ...edimHorizontalRuleNodes(),
      ...edimHeadingNodes(),
      ...edimCodeBlockNodes(),
      ...edimTableNodes(),
    },
    marks: {
      ...edimBoldMarks(),
      ...edimItalicMarks(),
      ...edimUnderlineMarks(),
      ...edimStrikeThroughMarks(),
      ...edimCodeMarks(),
      ...edimSubscriptMarks(),
      ...edimSuperscriptMarks(),
      ...edimFontFamilyMarks(),
      ...edimTextColorMarks(),
      ...edimLinkMarks(),
    },
  });

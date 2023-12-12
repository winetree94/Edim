import { Plugin as PMPlugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { edimBaseNodes, edimCorePlugins } from '@edim-editor/core';
import { edimHeadingNodes, edimHeadingPlugins } from '@edim-editor/heading';
import {
  edimParagraphNodes,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';
import {
  edimFlatBulletListNodes,
  edimFlatListItemNodes,
  edimFlatListPlugins,
  edimFlatOrderedListNodes,
} from '@edim-editor/flat-list';
import {
  edimFlatTaskListNodes,
  edimFlatTaskListItemNodes,
  edimFlatTaskListPlugins,
} from '@edim-editor/flat-task-list';
import {
  edimHorizontalRuleNodes,
  edimHorizontalRulePlugins,
} from '@edim-editor/hr';
import { edimLinkMarks } from '@edim-editor/link';
import { edimBoldMarks, edimBoldPlugins } from '@edim-editor/bold';
import { edimCodeMarks, edimCodePlugins } from '@edim-editor/code';
import { edimFontFamilyMarks } from '@edim-editor/font-family';
import { edimItalicMarks, edimItalicPlugins } from '@edim-editor/italic';
import {
  edimStrikeThroughMarks,
  edimStrikethroughPlugins,
} from '@edim-editor/strikethrough';
import {
  edimSubscriptMarks,
  edimSubscriptPlugins,
} from '@edim-editor/subscript';
import {
  edimSuperscriptMarks,
  edimSuperscriptPlugins,
} from '@edim-editor/superscript';
import { edimTextColorMarks } from '@edim-editor/text-color';
import {
  edimUnderlineMarks,
  edimUnderlinePlugins,
} from '@edim-editor/underline';
import {
  edimBlockQuotePlugins,
  edimBlockquoteNodes,
} from '@edim-editor/blockquote';
import {
  edimCodeBlockNodes,
  edimCodeBlockPlugins,
} from '@edim-editor/codeblock';
import {
  edimTableEditingPlugins,
  edimTableNodes,
  edimTablePlugins,
} from '@edim-editor/tables';
import { edimMenubarPlugins } from '@edim-editor/menubar';

export const allSchema = new Schema({
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

export const allPlugins = (): PMPlugin[] => [
  ...edimParagraphPlugins(),
  ...edimFlatListPlugins(),
  ...edimFlatTaskListPlugins(),
  ...edimBlockQuotePlugins(),
  ...edimHorizontalRulePlugins(),
  ...edimHeadingPlugins(),
  ...edimCodeBlockPlugins(),
  ...edimItalicPlugins(),
  ...edimBoldPlugins(),
  ...edimCodePlugins(),
  ...edimTablePlugins(),
  ...edimTableEditingPlugins(),
  ...edimCorePlugins(),
  ...edimUnderlinePlugins(),
  ...edimStrikethroughPlugins(),
  ...edimSubscriptPlugins(),
  ...edimSuperscriptPlugins(),
  ...edimMenubarPlugins(),
];

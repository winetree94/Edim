import { Plugin as PMPlugin } from 'prosemirror-state';
import { edimCorePlugins } from '@edim-editor/core';
import { edimHeadingPlugins } from '@edim-editor/heading';
import { edimParagraphPlugins } from '@edim-editor/paragraph';
import { edimFlatListPlugins } from '@edim-editor/flat-list';
import { edimFlatTaskListPlugins } from '@edim-editor/flat-task-list';
import { edimHorizontalRulePlugins } from '@edim-editor/hr';
import { edimBoldPlugins } from '@edim-editor/bold';
import { edimCodePlugins } from '@edim-editor/code';
import { edimItalicPlugins } from '@edim-editor/italic';
import { edimStrikethroughPlugins } from '@edim-editor/strikethrough';
import { edimSubscriptPlugins } from '@edim-editor/subscript';
import { edimSuperscriptPlugins } from '@edim-editor/superscript';
import { edimUnderlinePlugins } from '@edim-editor/underline';
import { edimBlockQuotePlugins } from '@edim-editor/blockquote';
import { edimCodeBlockPlugins } from '@edim-editor/codeblock';
import { edimTableEditingPlugins, edimTablePlugins } from '@edim-editor/tables';
import { edimMenubarPlugins } from '@edim-editor/menubar';

export const edimPresetPlugins = (): PMPlugin[] => [
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
  ...edimUnderlinePlugins(),
  ...edimStrikethroughPlugins(),
  ...edimSubscriptPlugins(),
  ...edimSuperscriptPlugins(),
  ...edimCorePlugins(),
  ...edimMenubarPlugins(),
];

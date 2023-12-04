import { PMP_DOC_NODE } from 'prosemirror-preset-document';
import {
  PMP_HEADING_NODE,
  createPmpHeadingPlugins,
} from 'prosemirror-preset-heading';
import {
  createPmpParagraphKeymapPlugins,
  PMP_PARAGRAPH_NODE,
} from 'prosemirror-preset-paragraph';
import {
  PMP_BULLET_FREE_LIST_NODE,
  PMP_FREE_LIST_ITEM_NODE,
  PMP_ORDERED_FREE_LIST_NODE,
  createPmpListPlugins,
} from 'prosemirror-preset-flat-list';
import {
  PMP_HORIZONTAL_RULE_NODE,
  createPmpHorizontalRulePlugins,
} from 'prosemirror-preset-hr';
import {
  PMP_ITALIC_MARK,
  createPmpItalicPlugins,
} from 'prosemirror-preset-italic';
import { PMP_IMAGE_NODE, creatPmpImagePlugins } from 'prosemirror-preset-image';
import { createPmpBasicKeymapPlugins } from 'prosemirror-preset-keymap';
import { createPmpHistoryPlugins } from 'prosemirror-preset-history';
import {
  PMP_MENTION_MARK,
  createPmpMentionPlugins,
} from 'prosemirror-preset-mention';
import { PMP_LINK_MARK } from 'prosemirror-preset-link';
import { PMP_STRIKETHROUGH_MARK } from 'prosemirror-preset-strikethrough';
import {
  PMP_BLOCKQUOTE_NODE,
  createPmpBlockQuotePlugins,
} from 'prosemirror-preset-blockquote';
import {
  PMP_CODE_BLOCK_NODE,
  createCodeBlockPlugins,
} from 'prosemirror-preset-codeblock';
import { PMP_TEXT_NODE } from 'prosemirror-preset-text';
import { PMP_TEXT_COLOR_MARK } from 'prosemirror-preset-text-color';
import {
  PMP_TABLE_NODES,
  createPmpTableEditingPlugins,
  createPmpTablePlugins,
} from 'prosemirror-preset-tables';
import { PMP_CODE_MARK, createPmpCodePlugins } from 'prosemirror-preset-code';
import {
  PMP_STRONG_MARK,
  createPmpStrongPlugins,
} from 'prosemirror-preset-strong';
import { PMP_EMOJI_NODE } from 'prosemirror-preset-emoji';
import { createPmpCommandPlugins } from 'prosemirror-preset-command';
import { Plugin } from 'prosemirror-state';
import {
  MentionItem,
  PmpCommandView,
  PmpImagePlaceholderViewProvider,
  PmpMentionView,
  PmpMenubarPlugin,
} from 'prosemirror-preset-view';
import { faker } from '@faker-js/faker';
import { Schema } from 'prosemirror-model';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';

const items: MentionItem[] = Array.from({ length: 100 }).map(() => ({
  icon: faker.image.avatar(),
  id: faker.string.uuid(),
  name: faker.person.fullName(),
}));

export const maximumSchema = new Schema({
  nodes: Object.assign(
    {},
    PMP_DOC_NODE,
    PMP_TEXT_NODE,
    PMP_PARAGRAPH_NODE,
    PMP_EMOJI_NODE,
    PMP_BULLET_FREE_LIST_NODE,
    PMP_FREE_LIST_ITEM_NODE,
    PMP_ORDERED_FREE_LIST_NODE,
    PMP_BLOCKQUOTE_NODE,
    PMP_HORIZONTAL_RULE_NODE,
    PMP_HEADING_NODE,
    PMP_CODE_BLOCK_NODE,
    PMP_IMAGE_NODE,
    PMP_TABLE_NODES,
  ),
  marks: Object.assign(
    {},
    PMP_TEXT_COLOR_MARK,
    PMP_MENTION_MARK,
    PMP_LINK_MARK,
    PMP_ITALIC_MARK,
    PMP_STRONG_MARK,
    PMP_CODE_MARK,
    PMP_STRIKETHROUGH_MARK,
  ),
});

export const maximumPlugins: Plugin[] = [].concat(
  createPmpParagraphKeymapPlugins({
    nodeType: maximumSchema.nodes['paragraph'],
  }),
  createPmpMentionPlugins({
    view: (view, pluginKey) => {
      return new PmpMentionView(view, pluginKey, (keyword) =>
        items.filter((item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );
    },
  }),
  createPmpCommandPlugins({
    view: (view, plugin) => new PmpCommandView(view, plugin),
  }),
  createPmpListPlugins({
    orderListNodeType: maximumSchema.nodes['ordered_list'],
    bulletListNodeType: maximumSchema.nodes['bullet_list'],
    listItemNodeType: maximumSchema.nodes['list_item'],
  }),
  createPmpBlockQuotePlugins({
    nodeType: maximumSchema.nodes['blockquote'],
  }),
  createPmpHorizontalRulePlugins({
    nodeType: maximumSchema.nodes['horizontal_rule'],
  }),
  createPmpHeadingPlugins({
    nodeType: maximumSchema.nodes['heading'],
    level: 6,
  }),
  createCodeBlockPlugins({
    nodeType: maximumSchema.nodes['code_block'],
  }),
  creatPmpImagePlugins({
    placeholderViewProvider: () => new PmpImagePlaceholderViewProvider(),
  }),
  createPmpItalicPlugins({
    markType: maximumSchema.marks['italic'],
  }),
  createPmpStrongPlugins({
    markType: maximumSchema.marks['strong'],
  }),
  createPmpCodePlugins({
    markType: maximumSchema.marks['code'],
  }),
  createPmpTablePlugins({}),
  createPmpTableEditingPlugins(),
  createPmpBasicKeymapPlugins({}),
  createPmpHistoryPlugins({}),
  [PmpMenubarPlugin, dropCursor(), gapCursor()],
);

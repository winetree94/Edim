import { PMP_DOC_NODE } from 'prosemirror-preset-document';
import { PMP_PARAGRAPH_NODE } from 'prosemirror-preset-paragraph';
import { createPmpBasicKeymapPlugins } from 'prosemirror-preset-keymap';
import { createPmpHistoryPlugins } from 'prosemirror-preset-history';
import { PMP_TEXT_NODE } from 'prosemirror-preset-text';
import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

export const minimalSchema = new Schema({
  nodes: Object.assign({}, PMP_DOC_NODE, PMP_TEXT_NODE, PMP_PARAGRAPH_NODE),
  marks: Object.assign({}),
});

export const minimalPlugins: Plugin[] = [].concat(
  createPmpBasicKeymapPlugins({}),
  createPmpHistoryPlugins({}),
);

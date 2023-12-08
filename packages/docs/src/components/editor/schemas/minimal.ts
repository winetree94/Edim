import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import {
  PMP_DOC_NODE,
  PMP_PARAGRAPH_NODE,
  PMP_TEXT_NODE,
  createPmpBasicKeymapPlugins,
  createPmpHistoryPlugins,
} from 'prosemirror-preset-core';

export const minimalSchema = new Schema({
  nodes: Object.assign({}, PMP_DOC_NODE, PMP_TEXT_NODE, PMP_PARAGRAPH_NODE),
  marks: Object.assign({}),
});

export const minimalPlugins: Plugin[] = [].concat(
  createPmpBasicKeymapPlugins({}),
  createPmpHistoryPlugins({}),
);

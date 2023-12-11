import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import {
  EDIM_DOC_NODES,
  EDIM_PARAGRAPH_NODE,
  EDIM_TEXT_NODES,
  createEdimBasicKeymapPlugins,
  createEdimHistoryPlugins,
} from 'prosemirror-preset-core';

export const minimalSchema = new Schema({
  nodes: Object.assign({}, EDIM_DOC_NODES, EDIM_TEXT_NODES, EDIM_PARAGRAPH_NODE),
  marks: Object.assign({}),
});

export const minimalPlugins: Plugin[] = [].concat(
  createEdimBasicKeymapPlugins({}),
  createEdimHistoryPlugins({}),
);

import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import {
  EDIM_DOC_NODES,
  EDIM_PARAGRAPH_NODE,
  EDIM_TEXT_NODES,
  createEdimCorePlugins,
} from '@edim-editor/core';
import { createEdimMenubarPlugins } from '@edim-editor/menubar';

export const minimalSchema = new Schema({
  nodes: {
    EDIM_DOC_NODES,
    EDIM_TEXT_NODES,
    EDIM_PARAGRAPH_NODE,
  },
  marks: {},
});

export const minimalPlugins: Plugin[] = [
  ...createEdimCorePlugins(),
  ...createEdimMenubarPlugins(),
];

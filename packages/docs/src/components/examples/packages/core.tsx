import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState, Plugin } from 'prosemirror-state';
import React, { useState } from 'react';
import { Schema } from 'prosemirror-model';
import {
  edimBaseNodes,
  edimCorePlugins,
  edimBasicKeymapPlugins,
  edimDropCursorPlugins,
  edimGapCursorPlugins,
  edimHistoryPlugins,
  edimVirtualCursorPlugins,
} from '@edim-editor/core';
import {
  edimParagraphNodes,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';

const schema = new Schema({
  nodes: {
    ...edimBaseNodes(),
    ...edimParagraphNodes(),
  },
});

const plugins: Plugin[] = [
  ...edimParagraphPlugins({
    nodeType: schema.nodes['paragraph'],
  }),
  ...edimCorePlugins(),
  // ...edimBasicKeymapPlugins(),
  // ...edimHistoryPlugins(),
  // ...edimVirtualCursorPlugins(),
  // ...edimDropCursorPlugins(),
  // ...edimGapCursorPlugins(),
];

export const CoreExample = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
      schema: schema,
      plugins: plugins,
    }),
  );

  return (
    <ProseMirror
      state={state}
      style={{ height: '300px' }}
      className="border"
      {...props}
    />
  );
};

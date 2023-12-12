import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState } from 'prosemirror-state';
import React, { useState } from 'react';
import { Schema } from 'prosemirror-model';
import { edimBaseNodes, edimCorePlugins } from '@edim-editor/core';
import {
  edimParagraphNodes,
  edimParagraphPlugins,
} from '@edim-editor/paragraph';

export const Minimal = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
      schema: new Schema({
        nodes: {
          ...edimBaseNodes(),
          ...edimParagraphNodes(),
        },
      }),
      plugins: [...edimCorePlugins(), ...edimParagraphPlugins()],
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

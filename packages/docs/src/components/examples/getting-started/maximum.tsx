import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState } from 'prosemirror-state';
import React, { useState } from 'react';
import { edimPresetSchema, edimPresetPlugins } from '@edim-editor/preset';

export const Maximum = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
      schema: edimPresetSchema,
      plugins: edimPresetPlugins(),
    }),
  );

  return <ProseMirror state={state} {...props} />;
};

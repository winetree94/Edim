import {
  ProseMirror,
  ProseMirrorProps,
} from '@site/src/components/editor/prose-mirror';
import { EditorState } from 'prosemirror-state';
import React, { useState } from 'react';
import { edimPresetSchema, edimPresetPlugins } from '@edim-editor/preset';

const schema = edimPresetSchema();
const plugins = edimPresetPlugins({ schema });

export const Maximum = (props: ProseMirrorProps) => {
  const [state] = useState(
    EditorState.create({
      schema: schema,
      plugins: plugins,
    }),
  );

  return <ProseMirror state={state} {...props} />;
};

import { ProseMirror } from '@site/src/components/editor/prose-mirror';
import { EditorState } from 'prosemirror-state';
import React, { useState } from 'react';
import { EDIM_PRESET_SCHEMA, edimPresetPlugins } from '@edim-editor/preset';

export const QuickStart = () => {
  const [state] = useState(
    EditorState.create({
      schema: EDIM_PRESET_SCHEMA,
      plugins: edimPresetPlugins(),
    }),
  );

  return <ProseMirror state={state} style={{ height: '300px' }} />;
};

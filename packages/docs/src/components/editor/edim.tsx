import React, { useRef, useState } from 'react';
import { ProseMirror, ProseMirrorRef } from './prose-mirror';
import { EditorState } from 'prosemirror-state';
import { EDIM_PRESET_SCHEMA, edimPresetPlugins } from '@edim-editor/preset';

export const Edim = () => {
  const editorRef = useRef<ProseMirrorRef>(null);

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.create({
      schema: EDIM_PRESET_SCHEMA,
      plugins: edimPresetPlugins(),
    }),
  );

  return (
    <ProseMirror
      ref={editorRef}
      state={editorState}
      attributes={{ spellCheck: 'false' }}
      onStateChange={(state) => setEditorState(state)}
    ></ProseMirror>
  );
};

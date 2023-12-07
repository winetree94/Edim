import { createContext } from 'preact';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface PmpMenubarContextType {
  editorView: EditorView;
  editorState: EditorState;
}

export const PmpMenubarContext = createContext<PmpMenubarContextType>({
  editorView: null as any,
  editorState: null as any,
});

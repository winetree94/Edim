import { createContext } from 'preact';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface EdimMenubarContextType {
  editorView: EditorView;
  editorState: EditorState;
}

export const EdimMenubarContext = createContext<EdimMenubarContextType>({
  editorView: null as any,
  editorState: null as any,
});

import { EdimMenubarPluginConfigs } from '../plugins';
import { createContext } from 'preact';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface EdimMenubarContextType {
  editorView: EditorView;
  editorState: EditorState;
  options: EdimMenubarPluginConfigs;
}

export const EdimMenubarContext = createContext<EdimMenubarContextType>({
  editorView: null as any,
  editorState: null as any,
  options: null as any,
});

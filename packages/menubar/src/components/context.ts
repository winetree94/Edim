import { createContext } from 'preact';
import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface EdimMenubarOptions {
  paragraphNodeType?: NodeType;
  headingNodeType?: NodeType;
  flatOrderedListNodeType?: NodeType;
  flatBulletListNodeType?: NodeType;
  flatListItemNodeType?: NodeType;
  blockQuoteNodeType?: NodeType;
  codeBlockNodeType?: NodeType;
  tableNodeType?: NodeType;
  linkNodeType?: NodeType;
}

export interface EdimMenubarContextType {
  editorView: EditorView;
  editorState: EditorState;
  options?: EdimMenubarOptions;
}

export const EdimMenubarContext = createContext<EdimMenubarContextType>({
  editorView: null as any,
  editorState: null as any,
});

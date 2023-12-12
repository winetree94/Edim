import { Node, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export interface NodePair {
  node: Node;
  pos: number;
  parent: Node | null;
}

export type NodeTypeOrGetter = NodeType | ((state: EditorState) => NodeType);

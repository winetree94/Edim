import {
  AttributeSpec,
  MarkType,
  Node,
  NodeSpec,
  NodeType,
} from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export interface NodePair {
  node: Node;
  pos: number;
  parent: Node | null;
}

export interface TypedNodeSpec<
  ATTRIBUTE_SPECS extends { [key: string]: AttributeSpec } = {
    [key: string]: AttributeSpec;
  },
  META = void,
> extends NodeSpec {
  attrs: ATTRIBUTE_SPECS;
  meta: META;
}

export type NodeTypeOrGetter = NodeType | ((state: EditorState) => NodeType);
export type MarkTypeOrGetter = MarkType | ((state: EditorState) => MarkType);

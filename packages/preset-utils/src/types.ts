import { Node } from 'prosemirror-model';

export interface NodePair {
  node: Node;
  pos: number;
  parent: Node | null;
}

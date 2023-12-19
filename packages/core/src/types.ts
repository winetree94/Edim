import { Node } from 'prosemirror-model';

export interface NodePair {
  node: Node;
  pos: number;
  parent: Node | null;
}

export interface BaseMarkConfigs {
  markName?: string;
}

export interface BaseNodeConfigs {
  nodeName?: string;
}

import { NodeSpec } from 'prosemirror-model';

export interface EdimBaseNodeConfigs {
  docNodeName?: string;
  textNodeName?: string;
}

export const edimBaseNodes = (): Record<string, NodeSpec> => ({
  doc: {
    group: 'block-container',
    content: 'block+',
  },
  text: {
    group: 'inline',
  },
});

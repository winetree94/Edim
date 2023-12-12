import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

export const EDIM_HORIZONTAL_RULE_NODE_NAME = 'horizontal_rule';

const hrDOM: DOMOutputSpec = ['hr'];
export const edimHorizontalRuleNodes = (): Record<string, NodeSpec> => ({
  [EDIM_HORIZONTAL_RULE_NODE_NAME]: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    },
  },
});

import { NodeSpec } from 'prosemirror-model';

export const EDIM_HORIZONTAL_RULE_NODE_NAME = 'horizontal_rule';

export interface EdimHorizontalRuleNodeConfigs {
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimHorizontalRuleNodeConfigs> = {
  nodeName: EDIM_HORIZONTAL_RULE_NODE_NAME,
};

export const edimHorizontalRuleNodes = (
  configs?: EdimHorizontalRuleNodeConfigs,
): Record<string, NodeSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return ['hr'];
    },
  };

  return {
    [mergedConfigs.nodeName]: nodeSpec,
  };
};

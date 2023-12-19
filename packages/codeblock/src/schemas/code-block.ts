import { DOMOutputSpec, NodeSpec } from 'prosemirror-model';

export const EDIM_CODEBLOCK_NODE_NAME = 'code_block';

const preDOM: DOMOutputSpec = [
  'pre',
  { class: 'edim-codeblock-wrapper' },
  [
    'code',
    {
      class: 'edim-codeblock-code',
    },
    0,
  ],
];

export interface EdimCodeBlockNodeConfigs {
  /**
   * node name
   *
   * @default "code_block"
   */
  nodeName?: string;
}

const DEFAULT_CONFIGS: Required<EdimCodeBlockNodeConfigs> = {
  nodeName: EDIM_CODEBLOCK_NODE_NAME,
};

export const edimCodeBlockNodes = (
  configs?: EdimCodeBlockNodeConfigs,
): Record<string, NodeSpec> => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const nodeSpec: NodeSpec = {
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return preDOM;
    },
  };

  return {
    [mergedConfigs.nodeName]: nodeSpec,
  };
};

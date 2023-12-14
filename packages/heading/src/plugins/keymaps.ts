import { setBlockType } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin, Command } from 'prosemirror-state';
import { EDIM_DEFAULT_HEADING_LEVEL } from '../schemas';

export interface EdimHeadingKeymapPluginConfigs {
  nodeType: NodeType;
  level?: number;
}

export const edimHeadingKeymapPlugins = (
  configs: EdimHeadingKeymapPluginConfigs,
): PMPlugin[] => {
  const level = configs?.level || EDIM_DEFAULT_HEADING_LEVEL;
  const headingKeymaps: Record<string, Command> = {};

  for (let i = 1; i <= level; i++) {
    headingKeymaps['Alt-Mod-' + i] = setBlockType(configs.nodeType, {
      level: i,
    });
  }

  return [keymap(headingKeymaps)];
};

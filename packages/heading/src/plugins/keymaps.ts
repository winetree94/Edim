import { setBlockType } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { NodeType } from 'prosemirror-model';
import { Plugin as PMPlugin, Command } from 'prosemirror-state';
import { EdimHeadingNodeSpec } from '../schemas';

export interface EdimHeadingKeymapPluginConfigs {
  nodeType: NodeType;
}

export const edimHeadingKeymapPlugins = (
  configs: EdimHeadingKeymapPluginConfigs,
): PMPlugin[] => {
  const levels = (configs.nodeType.spec as EdimHeadingNodeSpec).meta.levels;
  const headingKeymaps: Record<string, Command> = {};

  levels.forEach((level) => {
    headingKeymaps['Alt-Mod-' + level] = setBlockType(configs.nodeType, {
      level: level,
    });
  });

  return [keymap(headingKeymaps)];
};

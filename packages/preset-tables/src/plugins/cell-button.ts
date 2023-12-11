import { Plugin as PMPlugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { findCellClosestToPos } from '../utils';
import { EdimTableCellButtonWrapper } from '../components';
import { render } from 'preact';
import { html } from '@edim-editor/ui';

export const tableCellButtonPluginKey = new PluginKey('tableCellButtonPlugin');

export const edimTableCellButtonPlugins = (): PMPlugin[] => {
  const plugin: PMPlugin<DecorationSet> = new PMPlugin<DecorationSet>({
    key: tableCellButtonPluginKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr) {
        const selection = tr.selection;
        const cell = findCellClosestToPos(selection.$from);
        if (!cell) {
          return DecorationSet.empty;
        }
        const wrapper = document.createElement('div');
        wrapper.classList.add('edim-table-cell-buttons-wrapper');
        const deco = Decoration.widget(cell.pos + 1, wrapper, {
          destroy: () => {
            render(null, wrapper);
          },
        });
        render(html`<${EdimTableCellButtonWrapper} />`, wrapper);
        return DecorationSet.create(tr.doc, [deco]);
      },
    },
    props: {
      decorations(state) {
        return plugin.getState(state);
      },
    },
  });
  return [plugin];
};

import { Plugin as PMPlugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { findCellClosestToPos } from '../utils';
import { PmpTableCellButtonWrapper } from '../components';
import { render } from 'preact';
import { html } from 'prosemirror-preset-ui';

export const tableCellButtonPluginKey = new PluginKey('tableCellButtonPlugin');

export const createPmpTableCellButtonPlugins = (): PMPlugin[] => {
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
        wrapper.classList.add('pmp-table-cell-buttons-wrapper');
        const deco = Decoration.widget(cell.pos + 1, wrapper, {
          destroy: () => {
            render(null, wrapper);
          },
        });
        render(html`<${PmpTableCellButtonWrapper} />`, wrapper);
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

import { Plugin as PMPlugin, PluginKey, PluginView } from 'prosemirror-state';
import { findMark, isTextSelection } from '@edim-editor/core';
import { MarkType, Node as PMNode } from 'prosemirror-model';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { render } from 'preact';
import { html } from '@edim-editor/ui';
import { EdimLinkFloatingLayer } from '../components';

export interface EdimLinkFloatingLayerPluginState {
  active: {
    pos: number;
    node: PMNode;
    decorationSet?: DecorationSet;
  } | null;
}

const DEFAULT_STATE: Readonly<EdimLinkFloatingLayerPluginState> = {
  active: null,
};

export const EDIM_LINK_FLOATING_LAYER_PLUGIN_KEY =
  new PluginKey<EdimLinkFloatingLayerPluginState>('edim_link_floating_layer');

export interface edimLinkFloatingLayerPluginConfigs {
  markType: MarkType;
  view?: (view: EditorView) => PluginView;
}

const DEFAULT_CONFIGS: Required<
  Omit<edimLinkFloatingLayerPluginConfigs, 'markType'>
> = {
  view(editorView: EditorView) {
    const { active } = EDIM_LINK_FLOATING_LAYER_PLUGIN_KEY.getState(
      editorView.state,
    ) || { active: null };
    return {
      update: (view, prevState) => {
        const { active } = EDIM_LINK_FLOATING_LAYER_PLUGIN_KEY.getState(
          editorView.state,
        ) || { active: null };
      },
      destroy: () => {},
    };
  },
};

export const edimLinkFloatingLayerPlugins = (
  configs: edimLinkFloatingLayerPluginConfigs,
): PMPlugin[] => {
  const mergedConfigs = {
    ...DEFAULT_CONFIGS,
    ...configs,
  };

  const decorationDomWrapper = document.createElement('div');
  decorationDomWrapper.style.position = 'absolute';
  decorationDomWrapper.style.pointerEvents = 'none';
  let editorView: EditorView | null = null;

  const plugin: PMPlugin<EdimLinkFloatingLayerPluginState> =
    new PMPlugin<EdimLinkFloatingLayerPluginState>({
      key: EDIM_LINK_FLOATING_LAYER_PLUGIN_KEY,
      view: (view) => {
        editorView = view;
        return {};
      },
      state: {
        init: () => ({
          active: null,
        }),
        apply: (tr, value, oldState, newState) => {
          if (!isTextSelection(newState.selection)) {
            return DEFAULT_STATE;
          }

          const link = findMark(mergedConfigs.markType, {
            includeAdjacent: true,
          })(newState);

          if (!link) {
            return DEFAULT_STATE;
          }

          let decorationSet = value?.active?.decorationSet;
          if (!decorationSet) {
            const widget = Decoration.widget(0, decorationDomWrapper, {
              destroy: () => {
                render(null, decorationDomWrapper);
              },
            });
            decorationSet = DecorationSet.create(newState.doc, [widget]);
          }

          const viewPos = editorView!.dom.getBoundingClientRect();
          const startPos = editorView!.coordsAtPos(link.pos);
          const endPos = editorView!.coordsAtPos(link.pos + link.node.nodeSize);
          decorationDomWrapper.style.top = `${startPos.top - viewPos.top}px`;
          decorationDomWrapper.style.left = `${startPos.left - viewPos.left}px`;
          decorationDomWrapper.style.width = `${endPos.left - startPos.left}px`;
          decorationDomWrapper.style.height = `${
            endPos.bottom - startPos.top
          }px`;

          render(
            html`
              <${EdimLinkFloatingLayer}
                target=${decorationDomWrapper}
                href="${link.mark.attrs['href']}"
              />
            `,
            decorationDomWrapper,
          );

          return {
            active: {
              pos: link.pos,
              node: link.node,
              decorationSet: decorationSet,
            },
          };
        },
      },
      props: {
        decorations: (state) => {
          const set =
            plugin.getState(state)?.active?.decorationSet ||
            DecorationSet.empty;
          return set;
        },
      },
    });
  return [plugin];
};

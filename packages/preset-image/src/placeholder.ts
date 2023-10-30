import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

export interface ImagePlaceholderSpec {
  id: string;
  progress: number;
  viewProvider: ImagePlaceholderViewProvider;
  viewport_width: number;
  text_align: 'left' | 'center' | 'right';
  width: number;
  height: number;
  destroy?: () => void;
}

export interface ImagePlaceholderAddAction {
  type: 'add';
  id: string;
  pos: number;
  viewport_width: number;
  text_align: 'left' | 'center' | 'right';
  width: number;
  height: number;
  progress: number;
}

export interface ImagePlaceholderUpdateAction {
  type: 'update';
  id: string;
  progress: number;
}

export interface ImagePlaceholderRemoveAction {
  type: 'remove';
  id: string;
}

export type ImagePlaceholderActions =
  | ImagePlaceholderAddAction
  | ImagePlaceholderUpdateAction
  | ImagePlaceholderRemoveAction;

export const imagePlaceholderPluginKey = new PluginKey<DecorationSet>(
  'decorationPlugin',
);

export interface ImagePlaceholderViewProvider {
  init: (spec: ImagePlaceholderSpec) => HTMLElement;
  update?: (spec: ImagePlaceholderSpec) => void;
  destroy?: () => void;
}

class DefaultViewProvider implements ImagePlaceholderViewProvider {
  public init() {
    const div = document.createElement('div');
    div.innerHTML = 'loading...';
    return div;
  }
}

export interface ImagePlaceholderPluginConfigs {
  placeholderViewProvider?: (view: EditorView) => ImagePlaceholderViewProvider;
}

export const createImagePlaceholderPlugin = (
  configs: ImagePlaceholderPluginConfigs = {},
): Plugin<DecorationSet> => {
  let editorView: EditorView;
  const plugin: Plugin<DecorationSet> = new Plugin({
    key: imagePlaceholderPluginKey,
    view: (view) => {
      editorView = view;
      return {};
    },
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        const action = tr.getMeta(plugin) as ImagePlaceholderActions;

        if (action?.type === 'add') {
          const viewProvider: ImagePlaceholderViewProvider =
            configs.placeholderViewProvider
              ? configs.placeholderViewProvider(editorView)
              : new DefaultViewProvider();

          const spec: ImagePlaceholderSpec = {
            id: action.id,
            progress: action.progress,
            viewProvider,
            viewport_width: action.viewport_width,
            text_align: action.text_align,
            width: action.width,
            height: action.height,
            // TODO state 업데이트마다 호출됨
            // destroy: () => viewProvider.destroy?.(),
          };

          const deco = Decoration.widget(
            action.pos,
            viewProvider.init(spec),
            spec,
          );

          set = set.add(tr.doc, [deco]);
        } else if (action?.type === 'update') {
          const decorations = set.find(
            undefined,
            undefined,
            (spec: ImagePlaceholderSpec) => spec.id == action.id,
          );
          decorations.forEach((deco) => {
            const spec = deco.spec as ImagePlaceholderSpec;
            spec.progress = action.progress;
            spec.viewProvider.update?.(spec);
          });
        } else if (action?.type === 'remove') {
          const decorations = set.find(
            undefined,
            undefined,
            (spec: ImagePlaceholderSpec) => spec.id == action.id,
          );
          set = set.remove(decorations);
        }

        return set;
      },
    },
    props: {
      decorations(state) {
        return plugin.getState(state);
      },
    },
  });

  return plugin;
};

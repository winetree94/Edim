import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

export interface ImagePlaceholderSpec {
  id: string;
  progress: number;
  viewProvider: ImagePlaceholderViewProvider;
  // viewport_width: number;
  // width: number;
  // height: number;
}

export interface ImagePlaceholderAddAction {
  type: 'add';
  id: string;
  pos: number;
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
  init: () => HTMLElement;
  update?: (progress: number) => void;
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
      return {
        destroy: () => {
          console.log('destroy');
        },
      };
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

          const deco = Decoration.widget(action.pos, viewProvider.init(), {
            id: action.id,
            progress: action.progress,
            viewProvider,
            destroy: () => viewProvider.destroy?.(),
          } as ImagePlaceholderSpec);

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
            spec.viewProvider.update?.(action.progress);
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

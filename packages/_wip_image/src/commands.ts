import { EditorState } from 'prosemirror-state';
import { ImagePlaceholderSpec, imagePlaceholderPluginKey } from './placeholder';

export const findPlaceholderPos = (state: EditorState, id: string) => {
  const decos = imagePlaceholderPluginKey.getState(state);
  if (!decos) {
    return null;
  }
  const found = decos.find(
    undefined,
    undefined,
    (spec: ImagePlaceholderSpec) => spec.id == id,
  );
  return found.length ? found[0].from : null;
};

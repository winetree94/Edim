import { EditorState } from 'prosemirror-state';
import { imagePlaceholderPluginKey } from './placeholder';

export const findPlaceholder = (state: EditorState, id: string) => {
  const decos = imagePlaceholderPluginKey.getState(state);
  if (!decos) {
    return null;
  }
  const found = decos.find(undefined, undefined, (spec) => spec.id == id);
  return found.length ? found[0].from : null;
};

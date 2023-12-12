import { MarkType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { MarkTypeOrGetter } from '../types';

export const checkMarkTypeExistAndThrowError = (
  maybe?: MarkType | null | undefined,
): MarkType => {
  if (maybe instanceof MarkType) {
    return maybe;
  }
  throw new Error('node type is not defined');
};

export const parseMarkType = (
  typeOrGetter: MarkTypeOrGetter,
  state: EditorState,
): MarkType => {
  if (typeOrGetter instanceof MarkType) {
    return typeOrGetter;
  }
  const type = typeOrGetter(state);
  checkMarkTypeExistAndThrowError(type);
  return type;
};

/**
 * 플러그인에서 schema 를 참조할 수 없으므로, state 를 통해서 동적으로 schema 를 읽어야 함
 */
export const createEnsuredMarkType =
  (schemaKeyName: string) =>
  (defaultMarkType?: MarkType) =>
  (state: EditorState) => {
    const type = defaultMarkType || state.schema.marks[schemaKeyName];
    checkMarkTypeExistAndThrowError(type);
    return type;
  };

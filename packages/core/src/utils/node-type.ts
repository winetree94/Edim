import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { NodeTypeOrGetter } from '../types';

export const checkNodeTypeExistAndThrowError = (
  maybe?: NodeType | null | undefined,
): NodeType => {
  if (maybe instanceof NodeType) {
    return maybe;
  }
  throw new Error('node type is not defined');
};

export const parseNodeType = (
  typeOrGetter: NodeTypeOrGetter,
  state: EditorState,
): NodeType => {
  if (typeOrGetter instanceof NodeType) {
    return typeOrGetter;
  }
  const type = typeOrGetter(state);
  checkNodeTypeExistAndThrowError(type);
  return type;
};

/**
 * 플러그인에서 schema 를 참조할 수 없으므로, state 를 통해서 동적으로 schema 를 읽어야 함
 */
export const createEnsuredNodeType =
  (schemaKeyName: string) =>
  (defaultNodeType?: NodeType) =>
  (state: EditorState) => {
    return defaultNodeType || state.schema.nodes[schemaKeyName];
  };

import { Node } from 'prosemirror-model';
import { EdimFlatTaskListItemAttrs } from '../schemas';

export const createNode = (node: Node) => {
  const attrs = node.attrs as EdimFlatTaskListItemAttrs;
  const classes = ['edim-task-list-item'];
  if (attrs.align && attrs.align !== 'left') {
    classes.push(`edim-align-${attrs.align}`);
  }
  classes.push(`edim-indent-${attrs.indent || 1}`);
  if (attrs.checked) {
    classes.push('edim-task-list-item-checked');
  }

  const li = document.createElement('li');
  li.classList.add(...classes);
  li.dataset['textAlign'] = attrs.align || 'left';
  li.dataset['indent'] = `${attrs.indent || 1}`;
  li.dataset['checked'] = attrs.checked ? 'true' : 'false';
  return li;
}
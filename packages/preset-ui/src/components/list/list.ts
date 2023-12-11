import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface EdimOrderedListProps
  extends HTMLAttributes<HTMLOListElement> {}

export const EdimOrderedList = forwardRef<
  HTMLOListElement,
  EdimOrderedListProps
>(({ className, children, ...props }, ref) => {
  return html`
    <ol
      class=${classes('edim-view-ordered-list', className)}
      ...${props}
      ref=${ref}
    >
      ${children}
    </ol>
  `;
});

export interface EdimUnorderedListProps
  extends HTMLAttributes<HTMLUListElement> {}

export const EdimUnorderedList = forwardRef<
  HTMLUListElement,
  EdimUnorderedListProps
>(({ className, children, ...props }, ref) => {
  return html`
    <ul
      class=${classes('edim-view-unordered-list', className)}
      ...${props}
      ref=${ref}
    >
      ${children}
    </ul>
  `;
});

export interface EdimListItemProps extends HTMLAttributes<HTMLLIElement> {}

export const EdimListItem = forwardRef<HTMLLIElement, EdimListItemProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <li
        className=${classes('edim-view-list-item', className)}
        ...${props}
        ref=${ref}
      >
        ${children}
      </li>
    `;
  },
);

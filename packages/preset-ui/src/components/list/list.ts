import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface PmpOrderedListProps extends HTMLAttributes<HTMLOListElement> {}

export const PmpOrderedList = forwardRef<HTMLOListElement, PmpOrderedListProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <ol
        class=${classes('pmp-view-ordered-list', className)}
        ...${props}
        ref=${ref}
      >
        ${children}
      </ol>
    `;
  },
);

export interface PmpUnorderedListProps
  extends HTMLAttributes<HTMLUListElement> {}

export const PmpUnorderedList = forwardRef<
  HTMLUListElement,
  PmpUnorderedListProps
>(({ className, children, ...props }, ref) => {
  return html`
    <ul
      class=${classes('pmp-view-unordered-list', className)}
      ...${props}
      ref=${ref}
    >
      ${children}
    </ul>
  `;
});

export interface PmpListItemProps extends HTMLAttributes<HTMLLIElement> {}

export const PmpListItem = forwardRef<HTMLLIElement, PmpListItemProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <li
        className=${classes('pmp-view-list-item', className)}
        ...${props}
        ref=${ref}
      >
        ${children}
      </li>
    `;
  },
);

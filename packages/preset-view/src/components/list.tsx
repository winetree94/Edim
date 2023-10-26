import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../cdk/core';

export interface PmpOrderedListProps extends HTMLAttributes<HTMLOListElement> {}

export const PmpOrderedList = forwardRef<HTMLOListElement, PmpOrderedListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={classes('pmp-view-ordered-list', className)}
        {...props}
      >
        {children}
      </ol>
    );
  },
);

export interface PmpUnorderedListProps
  extends HTMLAttributes<HTMLUListElement> {}

export const PmpUnorderedList = forwardRef<
  HTMLUListElement,
  PmpUnorderedListProps
>(({ className, children, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={classes('pmp-view-unordered-list', className)}
      {...props}
    >
      {children}
    </ul>
  );
});

export interface PmpListItemProps extends HTMLAttributes<HTMLLIElement> {}

export const PmpListItem = forwardRef<HTMLLIElement, PmpListItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={classes('pmp-view-list-item', className)}
        {...props}
      >
        {children}
      </li>
    );
  },
);

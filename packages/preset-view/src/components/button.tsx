import { forwardRef } from 'preact/compat';
import { classes } from '../cdk/core';
import { JSX } from 'preact';

export interface PmpButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const PmpButton = forwardRef<HTMLButtonElement, PmpButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button className={classes('pmp-button', className)} {...props} ref={ref}>
        {children}
      </button>
    );
  },
);

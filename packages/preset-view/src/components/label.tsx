import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../cdk/core';

export interface PmpLabelProps extends HTMLAttributes<HTMLLabelElement> {}

export const PmpLabel = forwardRef<HTMLLabelElement, PmpLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label ref={ref} className={classes('pmp-label', className)} {...props}>
        {children}
      </label>
    );
  },
);

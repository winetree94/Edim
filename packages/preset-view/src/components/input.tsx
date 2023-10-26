import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../cdk/core';

export interface PmpInputProps extends HTMLAttributes<HTMLInputElement> {}

export const PmpInput = forwardRef<HTMLInputElement, PmpInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input ref={ref} className={classes('pmp-input', className)} {...props} />
    );
  },
);

import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../cdk/core';

export interface PmpParagraphProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const PmpParagraph = forwardRef<HTMLParagraphElement, PmpParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={classes('pmp-view-paragraph', className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);

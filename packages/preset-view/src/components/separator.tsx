import { classes } from '../cdk/core';
import { JSX } from 'preact';

export interface PmpSeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const PmpSeparator = ({
  className,
  children,
  ...props
}: PmpSeparatorProps) => {
  return (
    <div className={classes('pmp-view-separator', className)} {...props}>
      {children}
    </div>
  );
};

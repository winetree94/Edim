import { classes } from './core';
import { JSX } from 'preact';

export interface PmpButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const PmpButton = ({
  className,
  children,
  ...props
}: PmpButtonProps) => {
  return (
    <button className={classes('pmp-button', className)} {...props}>
      {children}
    </button>
  );
};

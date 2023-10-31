import { forwardRef } from 'preact/compat';
import { classes } from '../cdk/core';
import { JSX } from 'preact';
import { html } from '../cdk/html';

export interface PmpButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const PmpButton = forwardRef<HTMLButtonElement, PmpButtonProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <button class=${classes('pmp-button', className)} ...${props} ref=${ref}>
        ${children}
      </button>
    `;
  },
);
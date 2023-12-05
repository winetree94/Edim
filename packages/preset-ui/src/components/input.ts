import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../cdk/core';
import { html } from '../cdk/html';

export interface PmpInputProps extends HTMLAttributes<HTMLInputElement> {}

export const PmpInput = forwardRef<HTMLInputElement, PmpInputProps>(
  ({ className, ...props }, ref) => {
    return html`
      <input class=${classes('pmp-input', className)} ...${props} ref=${ref} />
    `;
  },
);

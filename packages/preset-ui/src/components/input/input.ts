import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface PmpInputProps extends HTMLAttributes<HTMLInputElement> {}

export const PmpInput = forwardRef<HTMLInputElement, PmpInputProps>(
  ({ className, ...props }, ref) => {
    return html`
      <input class=${classes('pmp-input', className)} ...${props} ref=${ref} />
    `;
  },
);

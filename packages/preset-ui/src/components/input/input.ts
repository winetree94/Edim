import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';

export interface EdimInputProps extends HTMLAttributes<HTMLInputElement> {}

export const EdimInput = forwardRef<HTMLInputElement, EdimInputProps>(
  ({ className, ...props }, ref) => {
    return html`
      <input class=${classes('edim-input', className)} ...${props} ref=${ref} />
    `;
  },
);

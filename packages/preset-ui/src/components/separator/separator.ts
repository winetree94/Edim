import { forwardRef } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { JSX } from 'preact';
import { html } from '../../cdk/render';

export interface PmpSeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const PmpSeparator = forwardRef<HTMLDivElement, PmpSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <div
        class=${classes('pmp-view-separator', className)}
        ...${props}
        ref=${ref}
      >
        ${children}
      </div>
    `;
  },
);

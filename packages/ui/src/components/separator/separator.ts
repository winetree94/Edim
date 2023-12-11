import { forwardRef } from 'preact/compat';
import { classes } from '../../cdk/utils/core';
import { JSX } from 'preact';
import { html } from '../../cdk/render';

export interface EdimSeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const EdimSeparator = forwardRef<HTMLDivElement, EdimSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    return html`
      <div
        class=${classes('edim-view-separator', className)}
        ...${props}
        ref=${ref}
      >
        ${children}
      </div>
    `;
  },
);

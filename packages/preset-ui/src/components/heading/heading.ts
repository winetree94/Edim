import { forwardRef, HTMLAttributes } from 'preact/compat';
import { classes, html } from '../../cdk';

export const PmpHeading1 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h1 className="${classes('pmp-ui-h1', className)}" ...${props} ref=${ref}>
      ${children}
    </h1>
  `;
});

export const PmpHeading2 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h2 className="${classes('pmp-ui-h2', className)}" ...${props} ref=${ref}>
      ${children}
    </h2>
  `;
});

export const PmpHeading3 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h3 className="${classes('pmp-ui-h3', className)}" ...${props} ref=${ref}>
      ${children}
    </h3>
  `;
});

export const PmpHeading4 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h4 className="${classes('pmp-ui-h4', className)}" ...${props} ref=${ref}>
      ${children}
    </h4>
  `;
});

export const PmpHeading5 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h5 className="${classes('pmp-ui-h5', className)}" ...${props} ref=${ref}>
      ${children}
    </h5>
  `;
});

export const PmpHeading6 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return html`
    <h6 className="${classes('pmp-ui-h6', className)}" ...${props} ref=${ref}>
      ${children}
    </h6>
  `;
});

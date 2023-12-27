import { ComponentChildren, createContext } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/compat';
import { EdimOverlay, html } from '../../cdk';

interface EdimPopoverOpenedState {
  triggerRef: HTMLElement | null;
}

interface EdimPopoverContextType {
  opened: EdimPopoverOpenedState | null;
  setOpened: (opened: EdimPopoverOpenedState | null) => void;
}

const EdimPopoverContext = createContext<EdimPopoverContextType>({
  opened: null,
  setOpened: () => {},
});

export interface EdimPopoverRootProps {
  children: ComponentChildren;
}

const EdimPopoverRoot = (props: EdimPopoverRootProps) => {
  const [opened, setOpened] = useState<EdimPopoverOpenedState | null>(null);

  return html`
    <${EdimPopoverContext.Provider} value="${{
      opened: opened,
      setOpened: setOpened,
    }}">
      ${props.children}
    </${EdimPopoverContext.Provider}>
  `;
};

export interface EdimPopoverTriggerProps {
  children: ComponentChildren;
}

const EdimPopoverTrigger = (props: EdimPopoverTriggerProps) => {
  const context = useContext(EdimPopoverContext);
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    const element = ref.current;
    if (!element || !(element instanceof HTMLElement)) {
      return;
    }
    if (context.opened && context.opened.triggerRef !== element) {
      context.setOpened({
        ...context.opened,
        triggerRef: element,
      });
    }
    const onClick = (e: MouseEvent) => {
      context.setOpened({
        triggerRef: element,
      });
    };
    element.addEventListener('click', onClick);
    return () => {
      element.removeEventListener('click', onClick);
    };
  }, [ref.current]);

  // const childrenWithProps = Children.map(props.children, (child) => {
  //   return cloneElement(child, { ...child.props, ref });
  // });

  return html`${props.children}`;
};

export interface EdimPopoverPortalProps {
  children: ComponentChildren;
}

const EdimPopoverPortal = (props: EdimPopoverPortalProps) => {
  const context = useContext(EdimPopoverContext);
  if (!context.opened) {
    return null;
  }
  return html`
    <${EdimOverlay}>
      ${props.children}
    </${EdimOverlay}>
  `;
};

export interface EdimPopoverContentProps {
  children: ComponentChildren;
}

const EdimPopoverContent = (props: EdimPopoverContentProps) => {
  const context = useContext(EdimPopoverContext);
  return html`<div className="edim-popover-content">${props.children}</div>`;
};

export const EdimPopover = {
  Root: EdimPopoverRoot,
  Trigger: EdimPopoverTrigger,
  Portal: EdimPopoverPortal,
  Content: EdimPopoverContent,
};

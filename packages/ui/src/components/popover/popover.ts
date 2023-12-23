import { Attributes, VNode, cloneElement, createContext } from 'preact';
import {
  Children,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'preact/compat';
import { html } from '../../cdk';

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
  children: VNode<Attributes> | VNode<Attributes>[];
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
  children: VNode<Attributes>;
}

const EdimPopoverTrigger = (props: EdimPopoverTriggerProps) => {
  const context = useContext(EdimPopoverContext);
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    console.log('useEffect');
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

  const childrenWithProps = Children.map(props.children, (child) => {
    return cloneElement(child, { ...child.props, ref });
  });

  return html`${childrenWithProps}`;
};

export interface EdimPopoverPortalProps {
  children: VNode<Attributes>;
}

const EdimPopoverPortal = (props: EdimPopoverPortalProps) => {
  const context = useContext(EdimPopoverContext);
  if (!context.opened) {
    return null;
  }
  return html`${props.children}`;
};

export interface EdimPopoverContentProps {
  children: VNode<Attributes>;
}

const EdimPopoverContent = (props: EdimPopoverContentProps) => {
  return html`${props.children}`;
};

export const EdimPopover = {
  Root: EdimPopoverRoot,
  Trigger: EdimPopoverTrigger,
  Portal: EdimPopoverPortal,
  Content: EdimPopoverContent,
};
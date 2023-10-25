import { DestroyRef, ElementRef, inject } from '@angular/core';
import { ComponentChild, ContainerNode, render } from 'preact';

export class PreactRef {
  public destroyed = false;
  public parent?: ContainerNode;

  public constructor(
    private readonly vnode: ComponentChild,
    parent: ContainerNode,
  ) {
    render(vnode, parent);
    this.parent = parent;
  }

  public destroy(): void {
    if (!this.parent) {
      return;
    }
    render(null, this.parent);
    this.parent.parentNode?.removeChild(this.parent as Node);
    this.parent = undefined;
    this.destroyed = true;
  }
}

export const usePreactRenderer = () => {
  let destroyed = false;
  const rendered: PreactRef[] = [];
  const elementRef = inject(ElementRef);
  const destroyRef = inject(DestroyRef);
  const defaultParentElement = elementRef.nativeElement as HTMLElement;

  destroyRef.onDestroy(() => {
    destroyed = true;
    rendered
      .filter((render) => !render.destroyed)
      .forEach((parent) => {
        parent.destroy();
      });
  });

  return (vnode: ComponentChild, parent?: ContainerNode): PreactRef => {
    if (destroyed) {
      throw new Error('Component has been destroyed');
    }
    if (parent) {
      const ref = new PreactRef(vnode, parent);
      rendered.push(ref);
      return ref;
    }
    const wrapper = document.createElement('div');
    defaultParentElement.appendChild(wrapper);
    const ref = new PreactRef(vnode, wrapper);
    rendered.push(ref);
    return ref;
  };
};

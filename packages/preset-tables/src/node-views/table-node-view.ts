import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { html } from 'prosemirror-preset-core';
import { createRef, render } from 'preact';
import { forwardRef, useImperativeHandle, useRef } from 'preact/compat';
import { updateColumnsOnResize } from 'prosemirror-tables';

export interface PmpTableViewRef {
  colgroup: () => HTMLTableColElement;
  table: () => HTMLTableElement;
  tbody: () => HTMLTableSectionElement;
}

export const PmpTableView = forwardRef<
  PmpTableViewRef,
  HTMLTableSectionElement
>((_, ref) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const colgroupRef = useRef<HTMLTableColElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useImperativeHandle(ref, () => ({
    colgroup: () => colgroupRef.current!,
    table: () => tableRef.current!,
    tbody: () => tbodyRef.current!,
  }));

  return html`
    <table className="pmp-table" ref=${tableRef}>
      <colgroup className="pmp-colgroup" ref=${colgroupRef}></colgroup>
      <tbody className="pmp-tbody" ref=${tbodyRef}></tbody>
    </table>
  `;
});

export class PmpTableNodeView implements NodeView {
  public ref = createRef<PmpTableViewRef>();
  public readonly dom = document.createElement('div');

  public get contentDOM() {
    return this.ref.current!.tbody();
  }

  public constructor(
    private node: PMNode,
    private readonly editorView: EditorView,
    private readonly getPos: () => number | undefined,
  ) {
    this.dom.classList.add('pmp-table-container');
    render(html`<${PmpTableView} ref=${this.ref}></${PmpTableView}>`, this.dom);
    updateColumnsOnResize(
      node,
      this.ref.current!.colgroup(),
      this.ref.current!.table(),
      100,
    );
  }

  public update(node: PMNode): boolean {
    if (node.type != this.node.type) {
      return false;
    }
    this.node = node;
    render(html`<${PmpTableView} ref=${this.ref}></${PmpTableView}>`, this.dom);
    updateColumnsOnResize(
      node,
      this.ref.current!.colgroup(),
      this.ref.current!.table(),
      100,
    );
    return true;
  }

  public destroy() {
    render(null, this.dom);
  }

  public ignoreMutation(record: MutationRecord): boolean {
    return !!(
      record.type == 'attributes' &&
      (record.target == this.ref.current?.table() ||
        this.ref.current?.colgroup().contains(record.target))
    );
  }
}

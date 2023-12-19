import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { html } from '@edim-editor/ui';
import { createRef, render } from 'preact';
import { forwardRef, useImperativeHandle, useRef } from 'preact/compat';
import { updateColumnsOnResize } from 'prosemirror-tables';

export interface EdimTableViewRef {
  colgroup: () => HTMLTableColElement;
  table: () => HTMLTableElement;
  tbody: () => HTMLTableSectionElement;
}

export const EdimTableView = forwardRef<
  EdimTableViewRef,
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
    <table className="edim-table" ref=${tableRef}>
      <colgroup className="edim-colgroup" ref=${colgroupRef}></colgroup>
      <tbody className="edim-tbody" ref=${tbodyRef}></tbody>
    </table>
  `;
});

export class EdimTableNodeView implements NodeView {
  public ref = createRef<EdimTableViewRef>();
  public readonly dom = document.createElement('div');

  public get contentDOM() {
    return this.ref.current!.tbody();
  }

  public constructor(
    private node: PMNode,
    private readonly editorView: EditorView,
    private readonly getPos: () => number | undefined,
  ) {
    this.dom.classList.add('edim-table-container');
    render(
      html`<${EdimTableView} ref=${this.ref}></${EdimTableView}>`,
      this.dom,
    );
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
    render(
      html`<${EdimTableView} ref=${this.ref}></${EdimTableView}>`,
      this.dom,
    );
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

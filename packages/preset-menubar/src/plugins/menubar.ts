/* eslint-disable @typescript-eslint/unbound-method */
import { render } from 'preact';
import { EditorState, Plugin, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { html } from 'prosemirror-preset-ui';
import { EdimMenubar } from '../components';

export class EdimMenubarView implements PluginView {
  public readonly editorRoot: HTMLDivElement;
  public readonly editorWrapper: HTMLDivElement;
  public readonly menubarWrapper: HTMLDivElement;
  public readonly editorView: EditorView;

  public isScrollTop = false;

  public constructor(editorView: EditorView) {
    this.editorView = editorView;

    const editorRoot = document.createElement('div');
    editorRoot.classList.add('edim-view-editor-root');
    this.editorRoot = editorRoot;

    const editorWrapper = document.createElement('div');
    editorWrapper.classList.add('edim-view-editor-scroll');
    this.editorWrapper = editorWrapper;

    const menubarWrapper = document.createElement('div');
    menubarWrapper.classList.add('edim-view-editor-menubar-root');
    this.menubarWrapper = menubarWrapper;

    editorView.dom.classList.add('edim-view-editor');
    const originParent = editorView.dom.parentElement!;
    const originIndex = Array.from(originParent.children).indexOf(
      editorView.dom,
    );
    this.editorRoot.appendChild(this.menubarWrapper);
    this.editorRoot.appendChild(this.editorWrapper);
    this.editorWrapper.appendChild(editorView.dom);
    originParent.insertBefore(
      this.editorRoot,
      originParent.children[originIndex],
    );
    this.render();
  }

  public update(editorView: EditorView, prevState: EditorState) {
    this.render();
  }

  public render() {
    render(
      html`
        <${EdimMenubar}
          editorView=${this.editorView}
          editorState=${this.editorView.state}
        />
      `,
      this.menubarWrapper,
    );
  }

  public destroy() {
    render(null, this.menubarWrapper);
  }
}

export const createEdimMenubarPlugins = (): Plugin[] => {
  return [
    new Plugin({
      view: (editorView) => {
        return new EdimMenubarView(editorView);
      },
    }),
  ];
};

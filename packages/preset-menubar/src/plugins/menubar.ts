/* eslint-disable @typescript-eslint/unbound-method */
import { render } from 'preact';
import { EditorState, Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { html } from 'prosemirror-preset-ui';
import { PmpMenubar } from '../components';

export class PmpMenubarView implements PluginView {
  public readonly editorRoot: HTMLDivElement;
  public readonly editorWrapper: HTMLDivElement;
  public readonly menubarWrapper: HTMLDivElement;
  public readonly editorView: EditorView;

  public isScrollTop = false;

  public constructor(editorView: EditorView) {
    this.editorView = editorView;

    const editorRoot = document.createElement('div');
    editorRoot.classList.add('pmp-view-editor-root');
    this.editorRoot = editorRoot;

    const editorWrapper = document.createElement('div');
    editorWrapper.classList.add('pmp-view-editor-scroll');
    this.editorWrapper = editorWrapper;

    const menubarWrapper = document.createElement('div');
    menubarWrapper.classList.add('pmp-view-editor-menubar-root');
    this.menubarWrapper = menubarWrapper;

    editorView.dom.classList.add('pmp-view-editor');
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
        <${PmpMenubar}
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

export const PmpMenubarPlugin = new Plugin({
  key: new PluginKey('pmp-menubar'),
  view: (editorView) => {
    return new PmpMenubarView(editorView);
  },
});

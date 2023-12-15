import { render } from 'preact';
import { EditorState, Plugin, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { html } from '@edim-editor/ui';
import { EdimMenubar } from '../components';
import { NodeType } from 'prosemirror-model';
import { EdimHeadingLevel } from '@edim-editor/heading';

export interface EdimMenubarPluginConfigs {
  textType?: {
    paragraphNodeType: NodeType;
    headingNodeType: NodeType;
    headingLevels: EdimHeadingLevel[];
  };
  fontFamily?: {
    fontFamilyMarkType?: NodeType;
  };
  flatOrderedListNodeType?: NodeType;
  flatBulletListNodeType?: NodeType;
  flatListItemNodeType?: NodeType;
  flatTaskListNodeType?: NodeType;
  flatTaskListItemNodeType?: NodeType;
  blockQuoteNodeType?: NodeType;
  codeBlockNodeType?: NodeType;
  tableNodeType?: NodeType;
  linkNodeType?: NodeType;
}

export class EdimMenubarView implements PluginView {
  public readonly editorRoot: HTMLDivElement;
  public readonly editorWrapper: HTMLDivElement;
  public readonly menubarWrapper: HTMLDivElement;

  public isScrollTop = false;

  public constructor(
    public readonly editorView: EditorView,
    private readonly configs: EdimMenubarPluginConfigs,
  ) {
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
          options=${this.configs}
        />
      `,
      this.menubarWrapper,
    );
  }

  public destroy() {
    render(null, this.menubarWrapper);
  }
}

export const edimMenubarPlugins = (
  configs: EdimMenubarPluginConfigs,
): Plugin[] => {
  const plugin = new Plugin({
    view: (editorView) => {
      return new EdimMenubarView(editorView, configs);
    },
  });
  return [plugin];
};

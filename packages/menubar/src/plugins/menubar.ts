import { render } from 'preact';
import { EditorState, Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { html } from '@edim-editor/ui';
import { EdimMenubar } from '../components';
import { MarkType, NodeType } from 'prosemirror-model';

export interface EdimMenubarPluginConfigs {
  position?: 'top' | 'bottom';
  textType?: {
    paragraphNodeType: NodeType;
    headingNodeType: NodeType;
  };
  fontFamily?: {
    fontFamilyMarkType?: MarkType;
  };
  textStyles?: {
    boldMarkType?: MarkType;
    italicMarkType?: MarkType;
    underlineMarkType?: MarkType;
    strikethroughMarkType?: MarkType;
    codeMarkType?: MarkType;
    subscriptMarkType?: MarkType;
    superscriptMarkType?: MarkType;
    useClearButton?: boolean;
  };
  textColor?: {
    textColorMarkType: MarkType;
  };
  align?: {};
  list?: {
    orderedListNodeType: NodeType;
    bulletListNodeType: NodeType;
    listItemNodeType: NodeType;
  };
  taskList?: {
    taskListNodeType: NodeType;
    taskListItemNodeType: NodeType;
  };
  blockquote?: {
    blockQuoteNodeType: NodeType;
  };
  codeblock?: {
    codeBlockNodeType: NodeType;
  };
  table?: {
    tableNodeType: NodeType;
  };
  link?: {
    linkMarkType: MarkType;
  };
  mention?: {
    mentionMarkType: MarkType;
  };
  translates?: {};
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

    if (configs.position === 'bottom') {
      this.editorRoot.appendChild(this.editorWrapper);
      this.editorRoot.appendChild(this.menubarWrapper);
      this.menubarWrapper.classList.add('bottom');
    } else {
      this.editorRoot.appendChild(this.menubarWrapper);
      this.editorRoot.appendChild(this.editorWrapper);
    }
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
    key: new PluginKey('edimMenubar'),
    view: (editorView) => {
      return new EdimMenubarView(editorView, configs);
    },
  });
  return [plugin];
};

import { PmpMenubarContext } from '../../context';
import { useContext } from 'preact/hooks';
import { PmpButton, html } from 'prosemirror-preset-ui';
import { toggleMark } from 'prosemirror-commands';
import { markActive } from 'prosemirror-preset-core';

export const PmpMenubarMarkToggleButtons = () => {
  const context = useContext(PmpMenubarContext);

  // marks
  const activeBold = markActive(
    context.editorView.state,
    context.editorView.state.schema.marks['strong'],
  );
  const activeItalic = markActive(
    context.editorView.state,
    context.editorView.state.schema.marks['em'],
  );
  const activeUnderline = markActive(
    context.editorView.state,
    context.editorView.state.schema.marks['underline'],
  );
  const activeStrikethrough = markActive(
    context.editorView.state,
    context.editorView.state.schema.marks['strikethrough'],
  );
  const activeSubscript = markActive(
    context.editorView.state,
    context.editorView.state.schema.marks['subscript'],
  );
  const activeSuperscript = markActive(
    context.editorView.state,
    context.editorView.state.schema.marks['superscript'],
  );
  const activeInlineCode = markActive(
    context.editorView.state,
    context.editorView.state.schema.marks['code'],
  );

  return html`
  <${PmpButton}
  className="pmp-icon-button ${activeBold ? 'selected' : ''}"
  onClick=${() => {
    toggleMark(context.editorView.state.schema.marks['strong'])(
      context.editorView.state,
      context.editorView.dispatch,
    );
    context.editorView.focus();
  }}
  >
  <i className="ri-bold" />
</${PmpButton}>

<${PmpButton}
  className="pmp-icon-button ${activeItalic ? 'selected' : ''}"
  onClick=${() => {
    toggleMark(context.editorView.state.schema.marks['em'])(
      context.editorView.state,
      context.editorView.dispatch,
    );
    context.editorView.focus();
  }}
  >
  <i className="ri-italic" />
</${PmpButton}>
<${PmpButton}
className="pmp-icon-button ${activeUnderline ? 'selected' : ''}"
onClick=${() => {
    toggleMark(context.editorView.state.schema.marks['underline'])(
      context.editorView.state,
      context.editorView.dispatch,
    );
    context.editorView.focus();
  }}
>
<i class="ri-underline"></i>
</${PmpButton}>
<${PmpButton}
  className="pmp-icon-button ${activeStrikethrough ? 'selected' : ''}"
  onClick=${() => {
    toggleMark(context.editorView.state.schema.marks['strikethrough'])(
      context.editorView.state,
      context.editorView.dispatch,
    );
    context.editorView.focus();
  }}
  >
  <i className="ri-strikethrough-2" />
</${PmpButton}>
<${PmpButton}
  className="pmp-icon-button ${activeSubscript ? 'selected' : ''}"
  onClick=${() => {
    toggleMark(context.editorView.state.schema.marks['subscript'])(
      context.editorView.state,
      context.editorView.dispatch,
    );
    context.editorView.focus();
  }}
  >
  <i className="ri-subscript-2" />
</${PmpButton}>
<${PmpButton}
  className="pmp-icon-button ${activeSuperscript ? 'selected' : ''}"
  onClick=${() => {
    toggleMark(context.editorView.state.schema.marks['superscript'])(
      context.editorView.state,
      context.editorView.dispatch,
    );
    context.editorView.focus();
  }}
  >
  <i className="ri-superscript-2" />
</${PmpButton}>
<${PmpButton}
  className="pmp-icon-button ${activeInlineCode ? 'selected' : ''}"
  onClick=${() => {
    toggleMark(context.editorView.state.schema.marks['code'])(
      context.editorView.state,
      context.editorView.dispatch,
    );
    context.editorView.focus();
  }}
  >
  <i className="ri-code-line" />
</${PmpButton}>
  `;
};

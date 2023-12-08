import { PmpMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  PmpButton,
  PmpParagraph,
  PmpSelect,
  PmpShortCut,
  html,
} from 'prosemirror-preset-ui';
import { toggleMark } from 'prosemirror-commands';
import { mac, markActive } from 'prosemirror-preset-core';

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

  const moreButtons = [
    {
      iconName: 'ri-underline',
      label: 'Underline',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['underline'],
      ),
      shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}U
        </${PmpShortCut}>
      `,
      command: () => {
        toggleMark(context.editorView.state.schema.marks['underline'])(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    },
    {
      iconName: 'ri-strikethrough-2',
      label: 'Strikethrough',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['strikethrough'],
      ),
      shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}S
        </${PmpShortCut}>
      `,
      command: () => {
        toggleMark(context.editorView.state.schema.marks['strikethrough'])(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    },
    {
      iconName: 'ri-code-line',
      label: 'Inline Code',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['code'],
      ),
      shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}M
        </${PmpShortCut}>
      `,
      command: () => {
        toggleMark(context.editorView.state.schema.marks['code'])(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    },
    {
      iconName: 'ri-subscript',
      label: 'Subscript',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['subscript'],
      ),
      shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'},
        </${PmpShortCut}>
      `,
      command: () => {
        toggleMark(context.editorView.state.schema.marks['subscript'])(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    },
    {
      iconName: 'ri-superscript',
      label: 'Superscript',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['superscript'],
      ),
      shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}.
        </${PmpShortCut}>
      `,
      command: () => {
        toggleMark(context.editorView.state.schema.marks['superscript'])(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    },
  ];

  const moreActive = moreButtons.some((button) => button.active);

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
    <${PmpSelect.Root} 
      hideArrow="${true}"
      className="pmp-icon-button ${moreActive ? 'selected' : ''}">
      <${PmpSelect.Text}>
        <i class="ri-more-fill"></i>
      </${PmpSelect.Text}>
      <${PmpSelect.OptionGroup} 
        className="pmp-menubar-more-marks-list">
        ${moreButtons.map(
          (button) => html`
          <${PmpSelect.Option}
            onClick="${button.command}"
            value="${button.iconName}"
            className="${button.active ? 'pmp-active' : ''}">
            <i className="${button.iconName}" />
            <${PmpParagraph} 
              className="pmp-menubar-more-marks-description">
              ${button.label}
            </${PmpParagraph}>
            ${button.shortcut}
          </${PmpSelect.Option}>
        `,
        )}
      </${PmpSelect.OptionGroup}>
    </${PmpSelect.Root}>
  `;
};

import { PmpMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  PmpButton,
  PmpParagraph,
  PmpSelect,
  PmpSeparator,
  PmpShortCut,
  html,
} from 'prosemirror-preset-ui';
import { toggleMark } from 'prosemirror-commands';
import { clearMarks, mac, markActive } from 'prosemirror-preset-core';
import { Attributes, VNode } from 'preact';

export interface PmpMenubarMarkButton {
  iconName: string;
  label: string;
  active: boolean;
  shortcut: VNode<Attributes> | VNode<Attributes>[];
  command: () => void;
}

export const PmpMenubarMarkToggleButtons = () => {
  const context = useContext(PmpMenubarContext);

  const buttons: PmpMenubarMarkButton[] = [];

  if (context.editorView.state.schema.marks['strong']) {
    buttons.push({
      iconName: 'ri-bold',
      label: 'Bold',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['strong'],
      ),
      shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}B
        </${PmpShortCut}>
      `,
      command: () => {
        toggleMark(context.editorView.state.schema.marks['strong'])(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (context.editorView.state.schema.marks['em']) {
    buttons.push({
      iconName: 'ri-italic',
      label: 'Italic',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['em'],
      ),
      shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}I
        </${PmpShortCut}>
      `,
      command: () => {
        toggleMark(context.editorView.state.schema.marks['em'])(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (context.editorView.state.schema.marks['underline']) {
    buttons.push({
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
    });
  }

  if (context.editorView.state.schema.marks['strikethrough']) {
    buttons.push({
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
    });
  }

  if (context.editorView.state.schema.marks['code']) {
    buttons.push({
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
    });
  }

  if (context.editorView.state.schema.marks['subscript']) {
    buttons.push({
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
    });
  }

  if (context.editorView.state.schema.marks['superscript']) {
    buttons.push({
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
    });
  }

  buttons.push({
    iconName: 'ri-format-clear',
    label: 'Clear Format',
    active: false,
    shortcut: html`
        <${PmpShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}\\
        </${PmpShortCut}>
      `,
    command: () => {
      clearMarks()(context.editorView.state, context.editorView.dispatch);
      context.editorView.focus();
    },
  });

  const contextButtons = buttons.splice(2);
  if (contextButtons.length === 1) {
    buttons.push(...contextButtons.splice(0, 1));
  }

  const contextActive = contextButtons.some((button) => button.active);

  return html`
    ${buttons.map(
      (button) => html`
      <${PmpButton}
        className="pmp-icon-button ${button.active ? 'selected' : ''}"
        onClick=${button.command}>
        <i className="${button.iconName}" />
      </${PmpButton}>
    `,
    )}
    ${contextButtons.length > 1 &&
    html`
     <${PmpSelect.Root} 
      hideArrow="${true}"
      className="pmp-icon-button ${contextActive ? 'selected' : ''}">
      <${PmpSelect.Text}>
        <i class="ri-more-fill"></i>
      </${PmpSelect.Text}>
      <${PmpSelect.OptionGroup} 
        className="pmp-menubar-more-marks-list">
        ${contextButtons.map(
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
    `}
    <${PmpSeparator} className="pmp-view-menubar-separator" />
  `;
};

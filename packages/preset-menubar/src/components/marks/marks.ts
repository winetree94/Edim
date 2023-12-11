import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  EdimButton,
  EdimParagraph,
  EdimSelect,
  EdimSeparator,
  EdimShortCut,
  html,
} from 'prosemirror-preset-ui';
import { toggleMark } from 'prosemirror-commands';
import { clearMarks, mac, markActive } from 'prosemirror-preset-core';
import { Attributes, VNode } from 'preact';

export interface EdimMenubarMarkButton {
  iconName: string;
  label: string;
  active: boolean;
  shortcut: VNode<Attributes> | VNode<Attributes>[];
  command: () => void;
}

export const EdimMenubarMarkToggleButtons = () => {
  const context = useContext(EdimMenubarContext);

  const buttons: EdimMenubarMarkButton[] = [];

  if (context.editorView.state.schema.marks['strong']) {
    buttons.push({
      iconName: 'ri-bold',
      label: 'Bold',
      active: markActive(
        context.editorView.state,
        context.editorView.state.schema.marks['strong'],
      ),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}B
        </${EdimShortCut}>
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
        <${EdimShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}I
        </${EdimShortCut}>
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
        <${EdimShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}U
        </${EdimShortCut}>
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
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}S
        </${EdimShortCut}>
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
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}M
        </${EdimShortCut}>
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
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'},
        </${EdimShortCut}>
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
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}.
        </${EdimShortCut}>
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
        <${EdimShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}\\
        </${EdimShortCut}>
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
      <${EdimButton}
        className="edim-icon-button ${button.active ? 'selected' : ''}"
        onClick=${button.command}>
        <i className="${button.iconName}" />
      </${EdimButton}>
    `,
    )}
    ${contextButtons.length > 1 &&
    html`
     <${EdimSelect.Root} 
      hideArrow="${true}"
      className="edim-icon-button ${contextActive ? 'selected' : ''}">
      <${EdimSelect.Text}>
        <i class="ri-more-fill"></i>
      </${EdimSelect.Text}>
      <${EdimSelect.OptionGroup} 
        className="edim-menubar-more-marks-list">
        ${contextButtons.map(
          (button) => html`
          <${EdimSelect.Option}
            onClick="${button.command}"
            value="${button.iconName}"
            className="${button.active ? 'edim-active' : ''}">
            <i className="${button.iconName}" />
            <${EdimParagraph} 
              className="edim-menubar-more-marks-description">
              ${button.label}
            </${EdimParagraph}>
            ${button.shortcut}
          </${EdimSelect.Option}>
        `,
        )}
      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}>   
    `}
    <${EdimSeparator} className="edim-view-menubar-separator" />
  `;
};

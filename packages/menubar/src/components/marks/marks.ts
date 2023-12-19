import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  EdimButton,
  EdimParagraph,
  EdimSelect,
  EdimSeparator,
  EdimShortCut,
  html,
} from '@edim-editor/ui';
import { toggleMark } from 'prosemirror-commands';
import { clearMarks, mac, markActive } from '@edim-editor/core';
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

  if (!context.options.textStyles) {
    return null;
  }

  const boldMarkType = context.options.textStyles.boldMarkType;
  const italicMarkType = context.options.textStyles.italicMarkType;
  const underlineMarkType = context.options.textStyles.underlineMarkType;
  const strikethroughMarkType =
    context.options.textStyles.strikethroughMarkType;
  const codeMarkType = context.options.textStyles.codeMarkType;
  const subscriptMarkType = context.options.textStyles.subscriptMarkType;
  const superscriptMarkType = context.options.textStyles.superscriptMarkType;
  const useClearButton = context.options.textStyles.useClearButton;

  const hasMark = !!Object.values(context.editorState.schema.marks).length;

  if (!hasMark) {
    return null;
  }

  const buttons: EdimMenubarMarkButton[] = [];

  if (boldMarkType) {
    buttons.push({
      iconName: 'ri-bold',
      label: 'Bold',
      active: markActive(context.editorView.state, boldMarkType),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}B
        </${EdimShortCut}>
      `,
      command: () => {
        toggleMark(boldMarkType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (italicMarkType) {
    buttons.push({
      iconName: 'ri-italic',
      label: 'Italic',
      active: markActive(context.editorView.state, italicMarkType),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}I
        </${EdimShortCut}>
      `,
      command: () => {
        toggleMark(italicMarkType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (underlineMarkType) {
    buttons.push({
      iconName: 'ri-underline',
      label: 'Underline',
      active: markActive(context.editorView.state, underlineMarkType),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘' : 'Ctrl+'}U
        </${EdimShortCut}>
      `,
      command: () => {
        toggleMark(underlineMarkType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (strikethroughMarkType) {
    buttons.push({
      iconName: 'ri-strikethrough-2',
      label: 'Strikethrough',
      active: markActive(context.editorView.state, strikethroughMarkType),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}S
        </${EdimShortCut}>
      `,
      command: () => {
        toggleMark(strikethroughMarkType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (codeMarkType) {
    buttons.push({
      iconName: 'ri-code-line',
      label: 'Inline Code',
      active: markActive(context.editorView.state, codeMarkType),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}M
        </${EdimShortCut}>
      `,
      command: () => {
        toggleMark(codeMarkType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (subscriptMarkType) {
    buttons.push({
      iconName: 'ri-subscript',
      label: 'Subscript',
      active: markActive(context.editorView.state, subscriptMarkType),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'},
        </${EdimShortCut}>
      `,
      command: () => {
        toggleMark(subscriptMarkType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (superscriptMarkType) {
    buttons.push({
      iconName: 'ri-superscript',
      label: 'Superscript',
      active: markActive(context.editorView.state, superscriptMarkType),
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌘⇧' : 'Ctrl+Shift+'}.
        </${EdimShortCut}>
      `,
      command: () => {
        toggleMark(superscriptMarkType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    });
  }

  if (useClearButton) {
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
  }

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

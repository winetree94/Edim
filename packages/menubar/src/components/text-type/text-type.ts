import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  EdimHeadingByNumber,
  EdimParagraph,
  EdimSelect,
  EdimShortCut,
  classes,
  html,
} from '@edim-editor/ui';
import { EdimHeadingNodeSpec } from '@edim-editor/heading';
import { mac, transformRangeToBlock } from '@edim-editor/core';
import { getTextType } from '../../utils';

export const EdimMenubarTextTypeSelect = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options?.textType) {
    return null;
  }

  const paragraphNodeType = context.options.textType.paragraphNodeType;
  const headingNodeType = context.options.textType.headingNodeType;
  const headingNodeSpec = headingNodeType.spec as EdimHeadingNodeSpec;

  const textType = getTextType(context.editorView.state);

  const textTypeOptions = [
    ...headingNodeSpec.meta.levels.map((level) => ({
      value: `h${level}`,
      label: `Heading ${level}`,
      Element: EdimHeadingByNumber[level],
      shortcut: html`
        <${EdimShortCut}>
          ${mac ? '⌥⌘' : 'Ctrl+Alt+'}${level}
        </${EdimShortCut}> 
      `,
      command: () => {
        transformRangeToBlock(headingNodeType, {
          level,
        })(context.editorView.state, context.editorView.dispatch);
        context.editorView.focus();
      },
    })),
    {
      value: 'p',
      label: 'Normal',
      Element: EdimParagraph,
      shortcut: html`
        <${EdimShortCut}>⌥⌘0</${EdimShortCut}> 
      `,
      command: () => {
        transformRangeToBlock(paragraphNodeType)(
          context.editorView.state,
          context.editorView.dispatch,
        );
        context.editorView.focus();
      },
    },
  ];

  return html`
    <${EdimSelect.Root} 
      className="${classes(
        'edim-menubar-text-select',
        textType !== 'p' ? 'edim-heading-selected' : '',
      )}"
      value="${textType}">
      <${EdimSelect.Text}>
        <${EdimParagraph}>
          ${
            textTypeOptions.find((option) => option.value === textType)
              ?.label || ''
          }
        </${EdimParagraph}>
      </${EdimSelect.Text}>
      <${EdimSelect.OptionGroup}>
        ${textTypeOptions.map((option) => {
          return html`
            <${EdimSelect.Option} value="${option.value}" onClick=${option.command}>
              <${option.Element} className="edim-menubar-select-text-type">${option.label}</${option.Element}> 
              ${option.shortcut}
            </${EdimSelect.Option}>
          `;
        })}
      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}> 
  `;
};

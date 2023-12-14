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
import { getTextType } from '../../utils';
import {
  EDIM_HEADING_DEFAULT_NODE_NAME,
  HeadingLevel,
} from '@edim-editor/heading';
import { mac, transformRangeToBlock } from '@edim-editor/core';
import { EDIM_PARAGRAPH_DEFAULT_NODE_NAME } from '@edim-editor/paragraph';

export const EdimMenubarTextTypeSelect = () => {
  const context = useContext(EdimMenubarContext);

  const paragraphNodeType =
    context.editorState.schema.nodes[EDIM_PARAGRAPH_DEFAULT_NODE_NAME];

  const headingNodeType =
    context.editorState.schema.nodes[EDIM_HEADING_DEFAULT_NODE_NAME];

  if (!paragraphNodeType || !headingNodeType) {
    return null;
  }

  const textType = getTextType(context.editorView.state);

  const textTypeOptions = [
    ...([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => ({
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

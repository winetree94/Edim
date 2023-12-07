import { PmpMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import {
  PmpHeadingByNumber,
  PmpParagraph,
  PmpSelect,
  PmpShortCut,
  classes,
  html,
} from 'prosemirror-preset-ui';
import { getTextType } from '../../utils';
import { HeadingLevel } from 'prosemirror-preset-heading';
import { transformRangeToBlock } from 'prosemirror-preset-core';

export const PmpMenubarTextTypeSelect = () => {
  const context = useContext(PmpMenubarContext);
  const textType = getTextType(context.editorView.state);
  const textTypeOptions = [
    ...([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => ({
      value: `h${level}`,
      label: `Heading ${level}`,
      Element: PmpHeadingByNumber[level],
      shortcut: html`
        <${PmpShortCut}>⌘ + ${level}</${PmpShortCut}> 
      `,
      command: () => {
        transformRangeToBlock(
          context.editorView.state.schema.nodes['heading'],
          {
            level,
          },
        )(context.editorView.state, context.editorView.dispatch);
        context.editorView.focus();
      },
    })),
    {
      value: 'p',
      label: 'Normal',
      Element: PmpParagraph,
      shortcut: html`
        <${PmpShortCut}>⌘ + p</${PmpShortCut}> 
      `,
      command: () => {
        transformRangeToBlock(
          context.editorView.state.schema.nodes['paragraph'],
        )(context.editorView.state, context.editorView.dispatch);
        context.editorView.focus();
      },
    },
  ];

  return html`
  <${PmpSelect.Root} 
  className="${classes(
    'pmp-menubar-text-select',
    textType !== 'p' ? 'pmp-heading-selected' : '',
  )}"
  value="${textType}">
  <${PmpSelect.Text}>
  <${PmpParagraph}>
    ${textTypeOptions.find((option) => option.value === textType)?.label || ''}
  </${PmpParagraph}>
  </${PmpSelect.Text}>
  <${PmpSelect.OptionGroup}>
    ${textTypeOptions.map((option) => {
      return html`
        <${PmpSelect.Option} value="${option.value}" onClick=${option.command}>
          <${option.Element} className="pmp-menubar-select-text-type">${option.label}</${option.Element}> 
          ${option.shortcut}
        </${PmpSelect.Option}>
      `;
    })}
  </${PmpSelect.OptionGroup}>
</${PmpSelect.Root}> 
  `;
};

import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimParagraph, EdimSelect, classes, html } from '@edim-editor/ui';
import {
  EdimFontFamilyAttrs,
  EdimFontFamilyMarkType,
  toggleFontFamily,
} from '@edim-editor/font-family';
import { markActive } from '@edim-editor/core';

export const EdimMenubarFontFamilySelect = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options?.fontFamily) {
    return null;
  }

  const fontFamilyMarkType = context.editorView.state.schema.marks[
    'font_family'
  ] as EdimFontFamilyMarkType;
  const currentMark = markActive(context.editorView.state, fontFamilyMarkType);
  const currentFont =
    (currentMark?.attrs as EdimFontFamilyAttrs | null)?.fontFamily || 'default';

  const fontOptions = [
    {
      value: 'default',
      command: () => {
        const tr =
          context.editorView.state.tr.removeStoredMark(fontFamilyMarkType);
        context.editorView.dispatch(tr);
        context.editorView.focus();
      },
    },
    ...fontFamilyMarkType.spec.fonts.map((font) => ({
      value: font.fontFamily,
      command: () => {
        toggleFontFamily(fontFamilyMarkType, {
          fontFamily: font.fontFamily,
        })(context.editorView.state, context.editorView.dispatch);
        context.editorView.focus();
      },
    })),
  ];
  return html`
    <${EdimSelect.Root} 
      className="${classes('edim-menubar-font-select')}"
      value="${currentFont}">
      <${EdimSelect.Text}>
        <${EdimParagraph}>
          ${
            fontOptions.find((option) => option.value === currentFont)?.value ||
            ''
          }
        </${EdimParagraph}>
      </${EdimSelect.Text}>
      <${EdimSelect.OptionGroup}>
        ${fontOptions.map((option) => {
          return html`
            <${EdimSelect.Option} value="${option.value}" onClick=${option.command}>
              <${EdimParagraph} style="font-family: ${option.value};">${option.value}</${EdimParagraph}> 
            </${EdimSelect.Option}>
          `;
        })}
      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}>
  `;
};

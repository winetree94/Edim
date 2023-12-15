import { EdimMenubarContext } from '../context';
import { useContext } from 'preact/hooks';
import { EdimSelect, EdimSeparator, classes, html } from '@edim-editor/ui';
import {
  TextAlignment,
  getRangeFirstAlignment,
  setAlignment,
} from '@edim-editor/paragraph';

export const EdimMenubarTextAlignSelect = () => {
  const context = useContext(EdimMenubarContext);

  if (!context.options.align) {
    return null;
  }

  const firstAlignment =
    getRangeFirstAlignment(context.editorView.state) || 'left';

  const alignmentOptions = (['left', 'center', 'right'] as TextAlignment[]).map(
    (align) => {
      return {
        value: align,
        icon: html`<i className="ri-align-${align}" />`,
        command: () => {
          setAlignment(align)(
            context.editorView.state,
            context.editorView.dispatch,
          );
          context.editorView.focus();
        },
      };
    },
  );

  return html`
    <${EdimSelect.Root} 
      className="${classes(
        'edim-menubar-align-select',
        firstAlignment !== 'left' ? 'edim-menubar-align-active' : '',
      )}"
      value="${firstAlignment}">
      <${EdimSelect.Text}>
        <i className="ri-align-${firstAlignment}" />
      </${EdimSelect.Text}>
      <${EdimSelect.OptionGroup} 
        matchWidth="${true}"
        className="edim-menubar-align-list">
      ${alignmentOptions.map(
        (option) => html`
        <${EdimSelect.Option} className="edim-menubar-align-option" value="${option.value}" onClick=${option.command}>
          <i className="ri-align-${option.value}" />
        </${EdimSelect.Option}>
      `,
      )}
      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}>
    <${EdimSeparator} className="edim-view-menubar-separator" />
  `;
};

import { html, EdimSelect } from '@edim-editor/ui';
import { Fragment } from 'preact';

export const EdimTableCellButtonWrapper = () => {
  return html`
    <${Fragment}>
      <${EdimSelect.Root} 
        className="edim-icon-button">
      <${EdimSelect.OptionGroup}>
        <${EdimSelect.Option} value="${'asdf'}">
          Insert Column Before
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Insert Column After
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Insert Row Before
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Insert Row After
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Delete Column
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Delete Row 
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Delete Table
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Merge Cell
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Split Cell
        </${EdimSelect.Option}>
        <${EdimSelect.Option} value="${'asdf'}">
          Delete Cell Content
        </${EdimSelect.Option}>

      </${EdimSelect.OptionGroup}>
    </${EdimSelect.Root}> 
    </${Fragment}>
  `;
};

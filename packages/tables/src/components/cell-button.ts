import {
  html,
  EdimButton,
  EdimPopover,
  EdimUnorderedList,
  EdimListItem,
} from '@edim-editor/ui';
import { Fragment } from 'preact';
import { useState } from 'preact/hooks';

export const EdimTableCellButtonWrapper = () => {
  const [opened, setOpened] = useState<boolean>(false);

  return html`
    <${Fragment}>
      <${EdimPopover.Root}>
        <${EdimPopover.Trigger}>
          <${EdimButton} className="edim-icon-button edim-table-cell-button">
            <i class="ri-arrow-down-s-line"></i>
          </${EdimButton}>
        </${EdimPopover.Trigger}>
        <${EdimPopover.Portal}>
          <${EdimPopover.Content}>
            <${EdimUnorderedList}>
              <${EdimListItem}>
                Hello World!
              </${EdimListItem}>
              <${EdimListItem}>
                Hello World!
              </${EdimListItem}>
              <${EdimListItem}>
                Hello World!
              </${EdimListItem}>
            </${EdimUnorderedList}>
          </${EdimPopover.Content}>
        </${EdimPopover.Portal}>
      </${EdimPopover.Root}>
    </${Fragment}>
  `;
};

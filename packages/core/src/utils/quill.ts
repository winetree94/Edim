export const parseQuillTextAlign = (element: HTMLElement): null | string => {
  const classList = element.classList;
  if (classList.contains('ql-align-center')) {
    return 'center';
  } else if (classList.contains('ql-align-right')) {
    return 'right';
  }
  return null;
};

export const parseQuillIndent = (element: HTMLElement): number => {
  let legacyIndent = 0;
  for (let i = 1; i <= 4; i++) {
    legacyIndent = element.classList.contains(`ql-indent-${i}`)
      ? i + 1
      : legacyIndent;
  }
  return legacyIndent;
};

export const isQuillTaskList = (element: HTMLElement): boolean => {
  return element.hasAttribute('data-checked');
};

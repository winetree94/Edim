export const mac =
  typeof navigator != 'undefined'
    ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
    : false;

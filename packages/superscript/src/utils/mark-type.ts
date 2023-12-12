import { createEnsuredMarkType } from '@edim-editor/core';
import { EDIM_SUPERSCRIPT_MARK_NAME } from '../schemas';

export const checkSuperscriptMarkType = createEnsuredMarkType(
  EDIM_SUPERSCRIPT_MARK_NAME,
);

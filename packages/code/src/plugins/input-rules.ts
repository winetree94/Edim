import { Plugin as PMPlugin } from 'prosemirror-state';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';
import { checkCodeMarkType } from '../utils';

export interface EdimCodeInputRulePluginConfigs {
  markType?: MarkType;
}

export const edimCodeInputRulePlugins = (
  configs?: EdimCodeInputRulePluginConfigs,
): PMPlugin[] => [
  inputRules({
    rules: [
      new InputRule(/`(.+)`$/, (state, match, start, end) => {
        const markType = checkCodeMarkType(configs?.markType)(state);
        return state.tr
          .replaceRangeWith(
            start,
            end,
            state.schema.text(match[1], [markType.create()]),
          )
          .removeStoredMark(markType)
          .insertText('\u200B', end - 1);
      }),
    ],
  }),
];

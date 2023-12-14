import { Plugin as PMPlugin } from 'prosemirror-state';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

export interface EdimCodeInputRulePluginConfigs {
  markType: MarkType;
}

export const edimCodeInputRulePlugins = (
  configs: EdimCodeInputRulePluginConfigs,
): PMPlugin[] => [
  inputRules({
    rules: [
      new InputRule(/`(.+)`$/, (state, match, start, end) => {
        return state.tr
          .replaceRangeWith(
            start,
            end,
            state.schema.text(match[1], [configs.markType.create()]),
          )
          .removeStoredMark(configs.markType)
          .insertText('\u200B', end - 1);
      }),
    ],
  }),
];

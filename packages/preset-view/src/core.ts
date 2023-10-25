import { JSX } from 'preact';

export const classes = (
  ...args: (string | JSX.SignalLike<string | undefined> | undefined)[]
) => {
  return args.filter(Boolean).join(' ');
};

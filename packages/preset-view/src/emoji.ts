import { classes } from './cdk/core';
import { html } from './cdk/html';
import emojiDataJson from 'emoji-datasource/emoji.json';

export interface PmpEmoji {
  name: string;
  unified: string;
  non_qualified: string;
  docomo: string;
  au: string;
  softbank: string;
  google: string;
  image: string;
  sheet_x: number;
  sheet_y: number;
  short_name: string;
  short_names: string[];
  text: string | null;
  texts: string[] | null;
  category: string;
  subcategory: string;
  sort_order: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
}

const emojis = emojiDataJson as PmpEmoji[];

const categories = Object.entries(
  emojis.reduce<{
    [key: string]: PmpEmoji[];
  }>((result, emoji) => {
    if (!result[emoji.category]) {
      result[emoji.category] = [];
    }
    result[emoji.category].push(emoji);
    return result;
  }, {}),
);

console.log(categories);

const size = 32;

export interface PmpEmojiPickerProps {}

export const PmpEmojiPicker = (props: PmpEmojiPickerProps) => {
  return html`
    <div class=${classes('pmp-view-emoji-picker')}>
      <div>emoji</div>
    </div>
  `;
};

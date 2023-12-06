import { classes } from '../../cdk/utils/core';
import { html } from '../../cdk/render';
import emojiDataJson from 'emoji-datasource/emoji.json';
import { PmpButton } from '../button';
import { useState } from 'preact/hooks';

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

const categoryMap = categories.reduce<{
  [key: string]: PmpEmoji[];
}>((result, [category, emojis]) => {
  result[category] = emojis;
  return result;
}, {});

export interface PmpEmojiPickerProps {
  size: number;
  gap: number;
}

const CategoryIcons = {
  Symbols: 'ri-character-recognition-fill',
  Activities: 'ri-basketball-line',
  Flags: 'ri-flag-line',
  'Travel & Places': 'ri-plane-fill',
  'Food & Drink': 'ri-restaurant-2-fill',
  'Animals & Nature': 'ri-bug-fill',
  'People & Body': 'ri-user-fill',
  Objects: 'ri-umbrella-fill',
  Components: 'ri-cpu-fill',
  'Smileys & Emotion': 'ri-smile-2-fill',
};

export const PmpEmojiPicker = (props: PmpEmojiPickerProps) => {
  const [currentCategory, setCurrentCategory] = useState<string>(
    categories[0][0],
  );

  return html`
    <div
      className=${classes('pmp-view-emoji-picker')}
      style=${{ width: (props.size + props.gap + props.gap) * 8 + 1 }}
    >
      <div className=${classes('pmp-view-emoji-category-group')}>
        ${categories.map(([category]) => {
          return html`
            <${PmpButton}
              className=${classes('pmp-view-emoji-category-button')}
              onClick=${() => setCurrentCategory(category)}>
              ${category}
            </${PmpButton}>
          `;
        })}
      </div>
      <div className=${classes('pmp-view-emoji-view')}>
        ${categoryMap[currentCategory].map((emoji) => {
          return html`
            <${PmpButton} 
              className=${classes('pmp-view-emoji-picker-emoji')}
              style=${{
                width: props.size,
                height: props.size,
                backgroundImage: 'url(/img/emoji/apple/sheets/32.png)',
                backgroundPosition: `${
                  emoji.sheet_x * -(props.size + props.gap + props.gap)
                }px ${emoji.sheet_y * -(props.size + props.gap + props.gap)}px`,
              }}
              data-emoji-name=${emoji.name}  
            >
            </${PmpButton}>
          `;
        })}
      </div>
    </div>
  `;
};
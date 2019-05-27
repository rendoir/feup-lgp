import { AvatarPlaceholder } from '../../../utils/types';

const placeholders = [
  'lblue',
  'blue',
  'purple',
  'red',
  'orange',
  'yellow',
  'green'
];

function getAvatarPlaceholder(id: number): AvatarPlaceholder {
  const idx = Math.abs(id) % placeholders.length;

  return placeholders[idx] as AvatarPlaceholder;
}

export default getAvatarPlaceholder;

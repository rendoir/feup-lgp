enum SIZES {
  tiny = 14,
  small = 22,
  medium = 28,
  large = 36,
  big = 100,
  supper = 150
}

export type AvatarSize = SIZES | number;

function getAvatarSize(size: AvatarSize): number {
  return size;
}

export default getAvatarSize;

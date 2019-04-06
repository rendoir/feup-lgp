import { isEmpty, filter } from "lodash";

function isEmoji(text: string): boolean {
  const pattern = /^[\uD83C-\uDBFF\uDC00-\uDFFF]+$/;
  return pattern.test(text);
}

function getAvatarText(title: string): string {
  if (title && title.length) {
    if (isEmoji(title)) {
      return "#";
    }

    const titleArray = filter(title.trim().split(" "), element => {
      if (isEmoji(element)) {
        return false;
      }
      return !isEmpty(element);
    });

    if (titleArray.length === 1) {
      return titleArray[0][0];
    } else if (titleArray.length > 1) {
      return `${titleArray[0][0]}${titleArray[1][0]}`;
    }
  }
  return "#";
}

export default getAvatarText;

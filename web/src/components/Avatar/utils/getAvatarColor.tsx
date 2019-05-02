import { AvatarPlaceholder } from "../../../utils/types";
import AvatarColors from "./AvatarColors";

export type Color = {
  type: "color";
  payload: string;
};

export type Gradient = {
  type: "gradient";
  payload: {
    from: string;
    to: string;
  };
};

function getAvatarColor(placeholder: AvatarPlaceholder): Gradient {
  return {
    payload: {
      from: AvatarColors[placeholder].from,
      to: AvatarColors[placeholder].to
    },
    type: "gradient"
  };
}

export default getAvatarColor;

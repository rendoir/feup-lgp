import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { IconSize } from "../../utils/types";

export type Props = {
  className?: string;
  icon: IconDefinition;
  size: IconSize;
  fixedWidth?: boolean;
  inverse: boolean;
  listItem?: boolean;
  rotation?: 90 | 180 | 270;
  flip?: "horizontal" | "vertical" | "both";
  spin?: boolean;
  pulse?: boolean;
  border?: boolean;
  pull?: "left" | "right";
  transform?: any;
  mask?: IconDefinition;
  symbol?: boolean;
  layer?: boolean;
};

class Icon extends Component<Props> {
  static defaultProps = {
    size: "sm",
    theme: "default",
    inverse: false
  };

  render() {
    const {
      className,
      icon,
      size,
      fixedWidth,
      inverse,
      listItem,
      rotation,
      flip,
      spin,
      pulse,
      border,
      pull,
      transform,
      mask,
      symbol,
      layer
    } = this.props;

    const props = {
      className,
      icon,
      size,
      inverse,
      border,
      transform,
      mask,
      symbol
    };

    if (layer) {
      return (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon
            {...props}
            fixedWidth={fixedWidth}
            listItem={listItem}
            rotation={rotation}
            flip={flip}
            spin={spin}
            pulse={pulse}
            pull={pull}
          />
          ;
        </span>
      );
    }

    return (
      <FontAwesomeIcon
        {...props}
        fixedWidth={fixedWidth}
        listItem={listItem}
        rotation={rotation}
        flip={flip}
        spin={spin}
        pulse={pulse}
        pull={pull}
      />
    );
  }
}

export default Icon;

import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { IconSize } from "../../utils/types";

export type Props = {
  className?: string;
  icon: IconDefinition;
  size: IconSize;
  fixedWidth?: boolean;
  inverse?: boolean;
  listItem?: boolean;
  rotation?: number;
  flip?: "horizontal" | "vertical" | "both";
  spin?: boolean;
  pulse?: boolean;
  border?: boolean;
  pull?: "left" | "right";
  transform?: any;
  mask?: IconDefinition;
};

class Icon extends Component<Props> {
  static defaultProps = {
    size: "sm",
    theme: "default"
  };

  render() {
    const { className, icon, size } = this.props;

    const props = {
      className,
      icon,
      size
    };

    return <FontAwesomeIcon {...props} />;
  }
}

export default Icon;

import React, { Component, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FaSymbol,
  FlipProp,
  IconProp,
  PullProp,
  RotateProp,
  Transform
} from "@fortawesome/fontawesome-svg-core";
import { ColorTheme, IconSize } from "../../utils/types";
import classNames from "classnames";
import styles from "./Icon.module.css";

export type Props = {
  className?: string;
  icon: IconProp;
  size: IconSize;
  style?: CSSProperties;
  theme: ColorTheme;
  fixedWidth?: boolean;
  inverse: boolean;
  listItem?: boolean;
  rotation?: RotateProp;
  flip?: FlipProp;
  spin?: boolean;
  pulse?: boolean;
  border?: boolean;
  pull?: PullProp;
  transform?: Transform;
  mask?: IconProp;
  symbol?: FaSymbol;
};

class Icon extends Component<Props> {
  static defaultProps = {
    type: "icon",
    size: "1x",
    theme: "default",
    inverse: false
  };

  render() {
    const {
      icon,
      size,
      style,
      theme,
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
      symbol
    } = this.props;

    const className = classNames(
      styles.container,
      {
        [styles[theme]]: theme,
        [styles.inverted]: inverse
      },
      this.props.className
    );

    const props = {
      className: className,
      icon,
      size,
      style,
      inverse,
      border,
      transform,
      mask,
      symbol
    };

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

import React, { Component } from "react";

import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ClassNames from "classnames";
import { ColorTheme, IconSize } from "../../utils/types";
import Icon from "../Icon/Icon";
import styles from "./IconButton.module.css";

export type Props = {
  className?: string;
  id?: string;
  style?: object;
  glyph: IconDefinition;
  size: "small" | "normal" | "large";
  iconSize?: IconSize;
  theme: ColorTheme;
  flat: boolean;
  disabled: boolean;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
};

class IconButton extends Component<Props> {
  public static defaultProps = {
    disabled: false,
    flat: false,
    size: "normal",
    theme: "default"
  };

  public render() {
    const {
      className,
      theme,
      size,
      disabled,
      id,
      flat,
      style,
      active,
      onClick,
      glyph,
      iconSize,
      ...otherProps
    } = this.props;

    const buttonClassName = ClassNames(
      styles.container,
      styles[size],
      {
        [styles.disabled]: disabled,
        [styles.defaultStyle]: !flat,
        [styles.flat]: flat,
        [styles[theme]]: flat,
        [styles.active]: active
      },
      className
    );

    return (
      <button
        className={buttonClassName}
        id={id}
        type="button"
        disabled={disabled}
        style={style}
        onClick={onClick}
        {...otherProps}
      >
        {this.renderIcon()}
      </button>
    );
  }

  private getIconSize(size: string): IconSize {
    switch (size) {
      case "small":
        return "xs";

      case "normal":
        return "sm";

      case "large":
        return "lg";

      default:
        return "lg";
    }
  }

  private renderIcon() {
    const { glyph, size, iconSize } = this.props;

    return (
      <Icon
        icon={glyph}
        className={styles.icon}
        size={iconSize || this.getIconSize(size)}
      />
    );
  }
}

export default IconButton;

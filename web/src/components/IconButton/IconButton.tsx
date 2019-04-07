import React, { Component } from "react";
import { ColorTheme, IconSize } from "../../utils/types";
import ClassNames from "classnames";
import styles from "./IconButton.module.css";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Icon from "../Icon/Icon";

export type Props = {
  className?: string;
  id?: string;
  style?: Object;
  glyph: IconDefinition;
  size: "small" | "normal" | "large";
  theme: ColorTheme;
  flat: boolean;
  disabled: boolean;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
};

class IconButton extends Component<Props> {
  button: HTMLButtonElement | null | undefined;

  static defaultProps = {
    size: "normal",
    flat: false,
    theme: "default",
    disabled: false
  };

  getIconSize(size: string): IconSize {
    switch (size) {
      case "small":
        return "xs";

      case "normal":
        return "sm";

      case "large":
        return "lg";

      default:
        return "sm";
    }
  }

  renderIcon() {
    const { glyph } = this.props;
    const { size } = this.props;

    return (
      <Icon
        icon={glyph}
        className={styles.icon}
        size={this.getIconSize(size)}
      />
    );
  }

  render() {
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
}

export default IconButton;

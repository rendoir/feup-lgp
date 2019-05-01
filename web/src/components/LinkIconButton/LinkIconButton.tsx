import React, { Component } from "react";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";
import { ColorTheme, IconSize } from "../../utils/types";
import Icon from "../Icon/Icon";
import styles from "../IconButton/IconButton.module.css";

export type Props = {
  /** LinkIconButton class attribute */
  className?: string;
  /** LinkIconButton id attribute */
  id?: string;
  /** LinkIconButton style attribute */
  style?: object;
  /** LinkIconButton icon */
  icon: IconProp;
  /** LinkIconButton size property */
  size: "small" | "normal" | "large";
  /** LinkIconButton theme property */
  theme: ColorTheme;
  /** LinkIconButton flat property */
  flat: boolean;
  /** LinkIconButton active attribute */
  active: boolean;
  /** LinkIconButton target attribute */
  target?: string;
  /** LinkIconButton href attribute */
  href: string;
};

class LinkIconButton extends Component<Props> {
  public static defaultProps = {
    flat: false,
    size: "normal",
    theme: "default"
  };

  public render() {
    const {
      theme,
      size,
      flat,
      style,
      active,
      href,
      target,
      id,
      ...otherProps
    } = this.props;

    const className = classNames(
      styles.container,
      styles[size],
      {
        [styles.defaultStyle]: !flat,
        [styles.flat]: flat,
        [styles[theme]]: flat,
        [styles.active]: active
      },
      this.props.className
    );

    return (
      <a
        href={href}
        target={target}
        className={className}
        style={style}
        id={id}
        {...otherProps}
      >
        {this.renderIcon()}
      </a>
    );
  }

  private getIconSize = (): IconSize => {
    const { size } = this.props;

    if (size === "small") {
      return "xs";
    }
    if (size === "normal") {
      return "sm";
    }
    return "lg";
  };

  private renderIcon() {
    const { icon } = this.props;
    const size = this.getIconSize();

    return <Icon icon={icon} className={styles.icon} size={size} />;
  }
}

export default LinkIconButton;

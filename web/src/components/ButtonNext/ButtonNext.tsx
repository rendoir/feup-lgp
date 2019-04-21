import React, { Component, ReactNode } from "react";

import classNames from "classnames";
import styles from "./ButtonNext.module.css";

export type Props = {
  /** Button id attribute */
  id?: string;
  /** Button class attribute */
  className?: string;
  /** Button children */
  children: ReactNode;
  /** Button disabled attribute */
  disabled: boolean;
  /** Button wide attribute */
  wide: boolean;
  /** Button rounded attribute */
  rounded: boolean;
  /** Button form attribute */
  form?: string;
  /** Button view */
  view: "button" | "outline";
  /** Button type attribute */
  type: "submit" | "reset" | "button";
  /** Button theme */
  theme: "primary" | "success" | "danger" | "info" | "warning";
  /** Button size */
  size: "small" | "normal" | "large";
  /** Button onClick event attribute */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
};

class ButtonNext extends Component<Props> {
  public static defaultProps = {
    disabled: false,
    rounded: true,
    size: "normal",
    theme: "primary",
    type: "button",
    view: "button",
    wide: false
  };

  public render() {
    const {
      id,
      type,
      form,
      disabled,
      theme,
      size,
      wide,
      rounded,
      children,
      view
    } = this.props;

    const className = classNames(
      styles.container,
      styles[theme],
      styles[view],
      styles[size],
      {
        [styles.wide]: wide,
        [styles.rounded]: rounded
      },
      this.props.className
    );

    return (
      <button
        id={id}
        className={className}
        type={type}
        form={form}
        disabled={disabled}
        onClick={this.props.onClick}
      >
        {children}
      </button>
    );
  }
}

export default ButtonNext;

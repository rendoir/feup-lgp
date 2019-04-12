import classNames from "classnames";
import React, { Component, ReactNode } from "react";
import styles from "./Button.module.css";

export interface Props {
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
  view: "button" | "outline" | "link";
  /** Button type attribute */
  type: "submit" | "reset" | "button";
  /** Button theme */
  theme: "primary" | "success" | "danger" | "info" | "warning";
  /** Button size */
  size: "small" | "normal" | "large";
  /** Button onClick event attribute */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
}

class Button extends Component<Props> {
  public static defaultProps = {
    view: "button",
    type: "button",
    theme: "primary",
    size: "normal",
    wide: false,
    rounded: true,
    disabled: false
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

export default Button;

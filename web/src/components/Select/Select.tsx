import React, { MouseEvent, ChangeEvent, Component, ReactNode } from "react";
import { ColorTheme } from "../../utils/types";
import classNames from "classnames";
import Icon from "../Icon/Icon";
import styles from "./Select.module.css";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export type Option = {
  value: string;
  title: string;
};

export type Props = {
  /** Select class attribute */
  className?: string;
  /** Select Wrapper class attribute */
  wrapperClassName?: string;
  /** Select id attribute */
  id: string;
  /** Select name attribute */
  name?: string;
  /** Select value attribute */
  value?: string;
  /** Select defaultValue attribute */
  defaultValue: string | undefined;
  /** Select disabled attribute */
  disabled?: boolean;
  /** Select label */
  label?: string;
  /** Select theme property */
  theme: ColorTheme;
  /** Select size property */
  size: "small" | "normal";
  /** Select options */
  options: Option[];
  /** Select placeholder attribute */
  placeholder?: string;
  /** Select onChange event handler attribute */
  onChange: (value: string) => unknown;
};

class Select extends Component<Props> {
  select: HTMLSelectElement | null | undefined;

  static defaultProps = {
    size: "normal",
    theme: "default"
  };

  handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    this.props.onChange(event.target.value);
  };

  handleLabelMouseDown = (event: MouseEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    if (this.select) {
      this.select.focus();
    }
  };

  setSelect = (select: any): void => {
    this.select = select;
  };

  focus(): void {
    if (this.select && document.activeElement !== this.select) {
      this.select.focus();
    }
  }

  renderOptions(): ReactNode {
    const options = this.props.options.map(option => {
      return (
        <option value={option.value} key={option.value} id={option.title}>
          {option.value}
        </option>
      );
    });

    if (this.props.placeholder) {
      options.unshift(
        <option key="__placeholder__" value="" disabled>
          {this.props.placeholder}
        </option>
      );
    }

    return options;
  }

  renderLabel() {
    const { id, label } = this.props;

    if (!label) {
      return null;
    }

    return (
      <label
        htmlFor={id}
        id={label}
        className={styles.label}
        onMouseDown={this.handleLabelMouseDown}
      >
        {label}
      </label>
    );
  }

  render() {
    const { id, name, disabled, size, theme } = this.props;
    const className = classNames(
      styles.container,
      styles[size],
      styles[theme],
      {
        [styles.disabled]: disabled
      },
      this.props.className
    );
    const wrapperClassName = classNames(
      styles.wrapper,
      this.props.wrapperClassName
    );

    return (
      <div className={className}>
        {this.renderLabel()}
        <div className={wrapperClassName}>
          <select
            className={styles.select}
            id={id}
            name={name}
            disabled={disabled}
            value={this.props.value || ""}
            defaultValue={this.props.defaultValue}
            ref={this.setSelect}
            onChange={this.handleChange}
          >
            {this.renderOptions()}
          </select>
          <Icon icon={faCaretDown} className={styles.arrow} size="lg" />
        </div>
      </div>
    );
  }
}

export default Select;

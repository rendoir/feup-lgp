import classNames from "classnames";
import React, { ChangeEvent, PureComponent } from "react";
import styles from "./Switcher.module.css";

export type Props = {
  className?: string;
  id: string;
  danger: boolean;
  name: string;
  value: boolean;
  disabled: boolean;
  hint?: string | null;
  tabIndex?: number;
  label?: string | null;
  description?: string | null;
  onChange: (value: boolean, event: ChangeEvent<HTMLInputElement>) => any;
};

class Switcher extends PureComponent<Props> {
  public static defaultProps = {
    danger: false,
    disabled: false,
    value: false
  };
  private input: HTMLInputElement | undefined | null;

  public handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!this.props.disabled) {
      this.props.onChange(event.target.checked, event);
    }
  };

  public setInput = (input: HTMLInputElement | null): void => {
    this.input = input;
  };

  public focus(): void {
    if (this.input) {
      this.input.focus();
    }
  }

  public blur(): void {
    if (this.input) {
      this.input.blur();
    }
  }

  public renderLabel() {
    const { label, id } = this.props;

    if (!label) {
      return null;
    }

    return (
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    );
  }

  public renderHint() {
    const { hint } = this.props;

    if (!hint) {
      return null;
    }

    return <div className={styles.hint}>{hint}</div>;
  }

  public renderDescription() {
    const { description } = this.props;

    if (!description) {
      return null;
    }

    return <div className={styles.description}>{description}</div>;
  }

  public render() {
    const { id, value, disabled, name, tabIndex, danger } = this.props;
    const className = classNames(styles.container, this.props.className, {
      [styles.checked]: value,
      [styles.disabled]: disabled,
      [styles.danger]: danger
    });

    return (
      <div className={styles.wrapper}>
        {this.renderDescription()}
        <div className={className}>
          <input
            className={styles.input}
            id={id}
            value={value ? "true" : "false"}
            checked={value}
            type={"checkbox"}
            tabIndex={tabIndex}
            ref={this.setInput}
            onChange={this.handleChange}
          />
          <label htmlFor={id} className={styles.switcher} />
          {this.renderLabel()}
        </div>
        {this.renderHint()}
      </div>
    );
  }
}

export default Switcher;

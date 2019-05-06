import React, { Component } from "react";

import classNames from "classnames";
import styles from "./InputNext.module.css";

export type HTMLAbstractInputElement = HTMLInputElement | HTMLTextAreaElement;

export type Props = {
  /** Input class attribute */
  className?: string;
  /** input class attribute */
  inputClassName?: string;
  /** input wrapper class attribute */
  wrapperClassName?: string;
  /** input prefix class attribute */
  prefixClassName?: string;
  /** input id attribute */
  id: string;
  /** input type attribute */
  type:
    | "text"
    | "number"
    | "email"
    | "search"
    | "tel"
    | "url"
    | "password"
    | "file"
    | "datetime-local"
    | "url"
    | "textarea";
  /** input value attribute */
  value?: string | number;
  /** input name attribute */
  name?: string;
  /** input label attribute */
  label?: string;
  /** input large attribute */
  large?: boolean;
  /** input placeholder attribute */
  placeholder?: string;
  /** input prefix */
  prefix?: string;
  /** input disabled attribute */
  disabled?: boolean;
  /** input hint */
  hint?: string;
  /** input status */
  status: "normal" | "success" | "error" | "warning";
  /** input autoFocus */
  autoFocus?: boolean;
  /** input tabIndex attribute */
  tabIndex?: number;
  /** Input maxLength attribute */
  maxLength?: number;
  /** Input length counter */
  lengthLimitCounter?: boolean;
  /** Input autofocus attribute */
  htmlAutoFocus?: boolean;
  /** Input spellcheck attribute */
  spellcheck?: boolean;
  /** Input readonly attribute */
  readOnly?: boolean;
  /** Input required attribute */
  required?: boolean;
  /** Input multiple attribute */
  multiple?: boolean;
  /** Input list attribute */
  list?: string;
  /** Textarea rows attribute */
  rows?: number;
  /** Textarea cols attribute */
  cols?: number;
  /** Input autocomplete attribute */
  autoComplete?: string | null | undefined;
  /** input onChange event attribute */
  onChange: (
    value: string,
    event: React.ChangeEvent<HTMLAbstractInputElement>
  ) => any;
  /** input onFocus event attribute */
  onFocus?: (event: React.FocusEvent<HTMLAbstractInputElement>) => any;
  /** input onBlur event attribute */
  onBlur?: (event: React.FocusEvent<HTMLAbstractInputElement>) => any;
  /** Input onKeyDown event attribute */
  onKeyUp?: (event: React.KeyboardEvent) => any;
};

export type State = {
  isFocused: boolean;
};

class InputNext extends Component<Props, State> {
  public static defaultProps = {
    required: false,
    spellcheck: "false",
    status: "normal",
    type: "text"
  };

  private input: HTMLInputElement | HTMLTextAreaElement | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      isFocused: false
    };
  }

  public render() {
    const {
      props: { value, disabled, status, large, readOnly },
      state: { isFocused }
    } = this;

    const className = classNames(
      styles.container,
      this.props.className,
      status ? styles[status] : null,
      value ? styles.filled : null,
      isFocused ? styles.focused : null,
      disabled ? styles.disabled : null,
      readOnly ? styles.readonly : null,
      large ? styles.large : null
    );

    const wrapperClassName = classNames(
      styles.inputWrapper,
      this.props.wrapperClassName
    );

    return (
      <div className={className}>
        {this.renderLabel()}
        {this.renderLengthLimitCounter()}
        <div className={wrapperClassName}>
          {this.renderPrefix()}
          {this.renderInput()}
        </div>
        {this.renderHint()}
      </div>
    );
  }

  public componentDidMount(): void {
    this.autoFocus();
  }

  public componentDidUpdate(): void {
    this.autoFocus();
  }

  public focus(): void {
    if (this.input && document.activeElement !== this.input) {
      this.input.focus();
    }
  }

  public blur(): void {
    if (this.input) {
      this.input.blur();
    }
  }

  private handleChange = (
    event: React.ChangeEvent<HTMLAbstractInputElement>
  ): void => {
    this.props.onChange(event.target.value, event);
  };

  private handleFocus = (
    event: React.FocusEvent<HTMLAbstractInputElement>
  ): void => {
    this.setState({ isFocused: true });

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  private handleBlur = (
    event: React.FocusEvent<HTMLAbstractInputElement>
  ): void => {
    if (this.isAutoFocus()) {
      event.preventDefault();
      event.target.focus();
      return;
    }

    this.setState({ isFocused: false });

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  private handleKeyUp = (event: React.KeyboardEvent): void => {
    const { onKeyUp } = this.props;

    if (onKeyUp) {
      onKeyUp(event);
    }
  };

  private isAutoFocus(): boolean {
    return Boolean(this.props.autoFocus) && !this.props.disabled;
  }

  private setInput = (element: any): void => {
    this.input = element;
  };

  private autoFocus(): void {
    if (this.isAutoFocus() && this.input) {
      if (document.activeElement !== this.input) {
        this.input.focus();
      }
    }
  }

  private renderLabel() {
    const { id, label } = this.props;

    if (!label) {
      return null;
    }

    return (
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    );
  }

  private renderHint() {
    const { hint } = this.props;

    if (!hint) {
      return null;
    }

    return <p className={styles.hint}>{hint}</p>;
  }

  private renderPrefix() {
    const { prefix, id } = this.props;

    if (!prefix) {
      return null;
    }
    const className = classNames(styles.prefix, this.props.prefixClassName);

    return (
      <label htmlFor={id} className={className}>
        {prefix}
      </label>
    );
  }

  private renderLengthLimitCounter() {
    const { maxLength, lengthLimitCounter } = this.props;

    if (!maxLength && !lengthLimitCounter) {
      return null;
    }

    const length = String(this.props.value).length;

    return (
      <div className={styles.lengthLimitCounter}>
        {`${length} ${maxLength ? `/ ${maxLength}` : ""}`}
      </div>
    );
  }

  private renderInput() {
    const {
      props: {
        id,
        name,
        type,
        value,
        disabled,
        tabIndex,
        htmlAutoFocus,
        placeholder,
        maxLength,
        spellcheck,
        rows,
        cols,
        required,
        multiple,
        list
      }
    } = this;

    const props = {
      className: classNames(styles.input, this.props.inputClassName),
      disabled,
      id,
      list,
      multiple,
      name,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onKeyUp: this.handleKeyUp,
      placeholder: placeholder ? placeholder : "",
      ref: this.setInput,
      required,
      tabIndex,
      type,
      value
    };

    if (type === "textarea") {
      return (
        <textarea
          {...props}
          spellCheck={spellcheck}
          tabIndex={tabIndex}
          rows={rows}
          cols={cols}
          maxLength={maxLength}
          autoFocus={htmlAutoFocus}
        />
      );
    }

    return (
      <input
        {...props}
        spellCheck={spellcheck}
        tabIndex={tabIndex}
        maxLength={maxLength}
        autoFocus={htmlAutoFocus}
      />
    );
  }
}

export default InputNext;

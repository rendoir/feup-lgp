import classNames from "classnames";
import React, { Component } from "react";
import styles from "./Input.module.css";

type HTMLAbstractInputElement = HTMLInputElement | HTMLTextAreaElement;

export interface Props {
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
    | "textarea";
  /** input value attribute */
  value: string | number;
  /** input name attribute */
  name?: string;
  /** input label attribute */
  label?: string;
  /** input large attribute */
  large?: boolean;
  /** input placeholder attribute */
  placeholder?: string;
  /** input prefix*/
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
  /** input spellcheck attribute */
  spellcheck?: boolean;
  /** input onChange event attribute */
  onChange: (
    value: string,
    event: React.ChangeEvent<HTMLAbstractInputElement>
  ) => any;
  /** input onFocus event attribute */
  onFocus?: (event: React.FocusEvent<HTMLAbstractInputElement>) => any;
  /** input onBlur event attribute */
  onBlur?: (event: React.FocusEvent<HTMLAbstractInputElement>) => any;
}

export interface State {
  isFocused: boolean;
}

class Input extends Component<Props, State> {
  static defaultProps = {
    type: "text",
    status: "normal",
    spellcheck: "false"
  };
  input?: HTMLInputElement | HTMLTextAreaElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      isFocused: false
    };
  }

  componentDidMount(): void {
    this.autoFocus();
  }

  componentDidUpdate(): void {
    this.autoFocus();
  }

  handleChange = (event: React.ChangeEvent<HTMLAbstractInputElement>): void => {
    this.props.onChange(event.target.value, event);
  };

  handleFocus = (event: React.FocusEvent<HTMLAbstractInputElement>): void => {
    this.setState({ isFocused: true });

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = (event: React.FocusEvent<HTMLAbstractInputElement>): void => {
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

  isAutoFocus(): boolean {
    return Boolean(this.props.autoFocus) && !this.props.disabled;
  }

  setInput = (element: any): void => {
    this.input = element;
  };

  autoFocus(): void {
    if (this.isAutoFocus() && this.input) {
      if (document.activeElement !== this.input) {
        this.input.focus();
      }
    }
  }

  focus(): void {
    if (this.input && document.activeElement !== this.input) {
      this.input.focus();
    }
  }

  blur(): void {
    if (this.input) {
      this.input.blur();
    }
  }

  renderLabel() {
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

  renderHint() {
    const { hint } = this.props;

    if (!hint) {
      return null;
    }

    return <p className={styles.hint}>{hint}</p>;
  }

  renderPrefix() {
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

  renderInput() {
    const {
      props: {
        id,
        name,
        type,
        value,
        disabled,
        tabIndex,
        placeholder,
        spellcheck
      }
    } = this;

    const props = {
      className: classNames(styles.input, this.props.inputClassName),
      disabled,
      id,
      name,
      placeholder: placeholder ? placeholder : "",
      type,
      value,
      ref: this.setInput,
      tabIndex,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus
    };

    if (type === "textarea") {
      return (
        <textarea {...props} spellCheck={spellcheck} tabIndex={tabIndex} />
      );
    }

    return <input {...props} spellCheck={spellcheck} tabIndex={tabIndex} />;
  }

  render() {
    const {
      props: { value, disabled, status, large },
      state: { isFocused }
    } = this;

    const className = classNames(
      styles.container,
      this.props.className,
      status ? styles[status] : null,
      value ? styles.filled : null,
      isFocused ? styles.focused : null,
      disabled ? styles.disabled : null,
      large ? styles.large : null
    );

    const wrapperClassName = classNames(
      styles.inputWrapper,
      this.props.wrapperClassName
    );

    return (
      <div className={className}>
        {this.renderLabel()}
        <div className={wrapperClassName}>
          {this.renderPrefix()}
          {this.renderInput()}
        </div>
        {this.renderHint()}
      </div>
    );
  }
}

export default Input;

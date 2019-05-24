import classNames from 'classnames';
import React, { ChangeEvent, PureComponent, ReactNode } from 'react';
import styles from './Radio.module.css';
import { RadioGroupContext, RadioGroupContextType } from './RadioGroupContext';

export type RadioProps = {
  className?: string;
  children: ReactNode;
  id?: string;
  value: string;
  tabIndex?: number;
  htmlAutoFocus?: boolean;
  disabled?: boolean;
};

class Radio extends PureComponent<RadioProps> {
  private inputRef: {
    current: HTMLInputElement | null;
  } = React.createRef();

  public render() {
    const { children, id, value, tabIndex, htmlAutoFocus } = this.props;

    return (
      <RadioGroupContext.Consumer>
        {radioGroup => {
          if (!radioGroup) {
            return null;
          }

          const disabled = this.props.disabled || radioGroup.disabled;
          const className = classNames(
            styles.container,
            {
              [styles.labeled]: Boolean(children),
              [styles.disabled]: disabled
            },
            this.props.className
          );

          return (
            <label className={className} htmlFor={id}>
              <input
                id={id}
                name={radioGroup.name}
                className={styles.input}
                type={'radio'}
                tabIndex={tabIndex}
                value={value}
                autoFocus={htmlAutoFocus}
                checked={value === radioGroup.value}
                ref={this.inputRef}
                onChange={this.handleChange(radioGroup)}
                disabled={disabled}
              />
              <span className={styles.radio} />
              {children ? <div className={styles.label}>{children}</div> : null}
            </label>
          );
        }}
      </RadioGroupContext.Consumer>
    );
  }

  public focus(): void {
    const { current: input } = this.inputRef;

    if (input) {
      input.focus();
    }
  }

  public blur(): void {
    const { current: input } = this.inputRef;

    if (input) {
      input.blur();
    }
  }

  private handleChange = (radioGroup: RadioGroupContextType) => (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    radioGroup.onChange(event.target.value, event);
  };
}

export default Radio;

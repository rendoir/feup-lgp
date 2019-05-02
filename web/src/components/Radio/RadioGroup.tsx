import React, { ChangeEvent, PureComponent, ReactNode } from "react";
import { RadioGroupContext } from "./RadioGroupContext";

export type RadioGroupProps = {
  className?: string;
  disabled: boolean;
  children: ReactNode;
  name?: string;
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => any;
};

export type Context = {
  radioGroup: {
    name: string;
    value: string;
    disabled?: boolean;
    onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => any;
  };
};

class RadioGroup extends PureComponent<RadioGroupProps> {
  public static defaultProps = {
    disabled: false
  };

  public render() {
    const { value, name, onChange, disabled } = this.props;

    return (
      <RadioGroupContext.Provider value={{ value, name, onChange, disabled }}>
        <div className={this.props.className}>{this.props.children}</div>
      </RadioGroupContext.Provider>
    );
  }
}

export default RadioGroup;

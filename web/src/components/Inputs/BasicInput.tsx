import * as React from "react";
import { Component } from "react";

/**
 * Basic input properties
 */
export interface IBasicInputProps {
  /** input label */
  label: string;
  /** onChange handler */
  onChange?: void;
}

/**
 * Form basic input
 */
export default class BasicInput extends Component<IBasicInputProps, {}> {
  render() {
    return (
      <div className="inputComponent">
        <label>
          {this.props.label}
          <br />
          <input type="text" placeholder="Basic placeholder" />
        </label>
      </div>
    );
  }
}

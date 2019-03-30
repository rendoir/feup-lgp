import * as React from "react";
import { Component } from "react";

/**
 * Button properties
 */
export interface IButtonProps {
  /** prop1 description */
  prop1?: string;
  /** prop2 description */
  prop2: number;
  /** prop3 description */
  prop3: number;
  /** prop4 description */
  prop4: "option1" | "option2" | "option3";
}

/**
 * Form button.
 */
export default class Button extends Component<IButtonProps, {}> {
  public render() {
    return <div>Test</div>;
  }
}

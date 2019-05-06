// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Challenge.module.css";

export type Props = {
  id: number;
  title: string;
  challengeType: string;
  datestart: string;
  dateend: string;
  prize: string;
  pointsPrize: number;
  content: any[];
};

export type State = {};

class TextChallenge extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    return null;
  }
}

export default TextChallenge;

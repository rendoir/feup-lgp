// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Challenge.module.css";
import QuestionOptions from "./QuestionOptions";
import TextChallenge from "./TextChallenge";

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

class Challenge extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const challenge = this.getChallenge();

    return <div>{this.getChallenge()}</div>;
  }

  public getChallenge() {
    let challenge;
    switch (this.props.challengeType) {
      case "question_options":
        challenge = <QuestionOptions {...this.props} />;
      case "livestream_view":
      case "comment_post":
      case "create_post":
      default:
        challenge = <TextChallenge {...this.props} />;
    }

    return challenge;
  }
}

export default Challenge;

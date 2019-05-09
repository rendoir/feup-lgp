// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Challenge.module.css";

import QuestionAnswer from "./QuestionAnswer";
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
    return <div className="container d-block w-75">{challenge}</div>;
  }

  public getChallenge() {
    switch (this.props.challengeType) {
      case "question_options":
        return <QuestionOptions {...this.props} />;
      case "answer_question":
        return <QuestionAnswer {...this.props} />;
      case "livestream_view":
      case "comment_post":
      case "create_post":
      default:
        return <TextChallenge {...this.props} />;
    }
  }
}

export default Challenge;

// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./Challenge.module.css";

import Input from "../Input/Input";

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

export type State = {
  value: string;
};

class QuestionAnswer extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {
      value: "answer_0"
    };
  }

  public render() {
    return (
      <div className="card">
        <div className="card-header">{this.props.title}</div>
        <div className="card-body">{this.parseContent()}</div>
        <div className={`card-footer ${styles.card_footer}`}>
          <button
            id="invite_modal_done"
            className="btn btn-info"
            type="button"
            data-dismiss="modal"
          >
            Solve Challenge
          </button>
        </div>
      </div>
    );
  }

  public parseContent() {
    const content = this.props.content;
    let question = "";
    let correctAnswer = "";

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < content.length; i++) {
      if (content[i].startsWith("Question: ")) {
        question = content[i].split("Question: ")[1];
      } else if (content[i].startsWith("CorrectAnswer: ")) {
        correctAnswer = content[i].split("CorrectAnswer: ")[1];
      }
    }

    return (
      <div>
        <h6 className="card-title">{question}</h6>
        <Input
          id="0"
          onChange={value => this.setState({ value })}
          value={this.state.value}
        />
      </div>
    );
  }
}

export default QuestionAnswer;

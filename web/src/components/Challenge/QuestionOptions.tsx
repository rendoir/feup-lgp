// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./Challenge.module.css";

import Radio from "../Radio/Radio";
import RadioGroup from "../Radio/RadioGroup";

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

class QuestionOptions extends Component<Props, State> {
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
        <div className="card-header d-flex flex-row">
          <div
            key={"Challenge_" + this.props.id + "_title"}
            className="mr-auto"
          >
            {this.props.title}
          </div>
          <div className={styles.challenge_end}>
            Ending at: {this.props.dateend}
          </div>
        </div>
        <div className="card-body">
          {this.parseContent()}
          <hr key={"Hr_Challenge_" + this.props.id} />
          {this.parsePrize()}
        </div>
        <div className={`card-footer ${styles.card_footer}`}>
          <button
            id="invite_modal_done"
            className="btn btn-info"
            type="button"
            data-dismiss="modal"
            onClick={this.solveChallenge}
          >
            Solve Challenge
          </button>
        </div>
      </div>
    );
  }

  public parsePrize() {
    let prize = "";

    if (this.props.prize === "points") {
      prize = `Win ${this.props.pointsPrize} points !`;
    } else {
      prize = `Win ${this.props.prize} !`;
    }

    return (
      <p key={"Prize_Challenge_" + this.props.id} className="card-text">
        {" "}
        {prize}{" "}
      </p>
    );
  }

  public parseContent() {
    const content = this.props.content;
    let question = "";
    let correctAnswer = "";
    const possibleAnswers: any[] = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < content.length; i++) {
      if (content[i].startsWith("Question: ")) {
        question = content[i].split("Question: ")[1];
        if (!question.includes("?")) {
          question += " ?";
        }
      } else if (content[i].startsWith("CorrectAnswer: ")) {
        correctAnswer = content[i].split("CorrectAnswer: ")[1];
      } else if (content[i].startsWith("Answer: ")) {
        possibleAnswers.push(content[i].split("Answer: ")[1]);
      }
    }

    const answers: any[] = [];

    if (possibleAnswers.length > 0) {
      for (let i = 0; i < possibleAnswers.length; i++) {
        const value = "answer_" + i;
        answers.push(
          <Radio
            key={"Radio_Challenge_" + this.props.id + "_" + value}
            value={value}
          >
            {possibleAnswers[i]}
          </Radio>
        );
        answers.push(
          <br key={"Br_Challenge_" + this.props.id + "_" + value} />
        );
      }
    }

    return (
      <div>
        <h6 className="card-title">{question}</h6>
        <ul className="answers">
          <RadioGroup
            key={"Challenge_" + this.props.id}
            onChange={value => this.setState({ value })}
            value={this.state.value}
          >
            {answers}
          </RadioGroup>
        </ul>
      </div>
    );
  }

  public solveChallenge() {
    return null;
  }
}

export default QuestionOptions;

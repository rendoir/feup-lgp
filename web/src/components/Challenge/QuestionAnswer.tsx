import axios from "axios";

// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./Challenge.module.css";

import Input from "../Input/Input";

// - Import utils
import { dictionary, LanguageContext } from "../../utils/language";

export type Props = {
  confId: number;
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
  correctAnswer: string;
  isCorrect: boolean | undefined;
  value: string;
  question: string;
};

class QuestionAnswer extends Component<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {
      correctAnswer: "",
      isCorrect: undefined,
      question: "",
      value: ""
    };

    this.handleSolveChallenge = this.handleSolveChallenge.bind(this);
  }

  public componentDidMount() {
    const content = this.props.content;
    let question = "";
    let correctAnswer = "";

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < content.length; i++) {
      if (content[i].startsWith("Question: ")) {
        question = content[i].split("Question: ")[1];
        if (!question.includes("?")) {
          question += " ?";
        }
      } else if (content[i].startsWith("CorrectAnswer: ")) {
        correctAnswer = content[i].split("CorrectAnswer: ")[1];
      }
    }

    this.apiSolvedState(question, correctAnswer);
  }

  public apiSolvedState(question: string, correctAnswer: string) {
    let getUrl = `${location.protocol}//${location.hostname}`;
    getUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    getUrl += `/conference/${this.props.confId}/challenge/solvedState`;

    axios
      .get(getUrl, {
        params: {
          author: 1, // When loggin, this is the user logged in
          challenge: this.props.id,
          headers: {}
        }
      })
      .then(res => {
        let value = "";
        let isCorrect: boolean | undefined;

        if (res.data.state.length > 0) {
          value = res.data.state[0].answer;
          isCorrect = res.data.state[0].complete;
        }

        this.setState({ question, correctAnswer, isCorrect, value });
      })
      .catch(() => {
        console.log("Failed to get state of challenge");
        this.setState({ question, correctAnswer });
      });
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
            {dictionary.ending_at[this.context]} {this.props.dateend}
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
            onClick={this.handleSolveChallenge}
            disabled={this.getButtonRequiredClass()}
          >
            {dictionary.solve_challenge[this.context]}
          </button>
        </div>
      </div>
    );
  }

  public parsePrize() {
    let prize = "";

    if (
      this.props.prize.includes("points") ||
      this.props.prize.includes("Points")
    ) {
      prize = `${dictionary.win[this.context]} ${this.props.pointsPrize} ${
        dictionary.points[this.context]
      } !`;
    } else {
      prize = `${dictionary.win[this.context]} ${this.props.prize} !`;
    }

    return (
      <p key={"Prize_Challenge_" + this.props.id} className="card-text">
        {" "}
        {prize}{" "}
      </p>
    );
  }

  public parseContent() {
    return (
      <div>
        <h6 className="card-title">{this.state.question}</h6>
        <Input
          id="0"
          className={this.getInputRequiredStyle()}
          onChange={value => this.setState({ value })}
          placeholder={dictionary.write_answer[this.context]}
          value={this.state.value}
          disabled={this.getButtonRequiredClass()}
        />
      </div>
    );
  }

  public getInputRequiredStyle() {
    let css = `${styles.normal}`;

    if (this.state.isCorrect === true) {
      css = `${styles.correct_answer}`;
    } else if (this.state.isCorrect === false) {
      css = `${styles.wrong_answer}`;
    }

    return css;
  }

  public getButtonRequiredClass() {
    return this.state.isCorrect !== undefined ? true : false;
  }

  public handleSolveChallenge() {
    if (this.state.value === this.state.correctAnswer) {
      this.setState({ isCorrect: true });
    } else {
      this.setState({ isCorrect: false });
    }

    this.apiSolveChallenge();
  }

  public apiSolveChallenge() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += `/conference/${this.props.confId}/challenge/solve`;

    axios
      .post(postUrl, {
        author: 1, // When loggin, this is the user logged in
        challenge: this.props.id,
        challenge_answer: this.state.value,
        completion: this.state.isCorrect ? true : false,
        headers: {}
      })
      .then(res => {
        console.log("Challenge solved - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
  }
}

export default QuestionAnswer;

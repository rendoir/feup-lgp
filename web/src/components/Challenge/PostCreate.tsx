import axiosInstance from "../../utils/axiosInstance";

// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./Challenge.module.css";

// - Import utils
import { dictionary, LanguageContext } from "../../utils/language";

export type Props = {
  talkID: number;
  id: number;
  title: string;
  challengeType: string;
  datestart: string;
  dateend: string;
  prize: string;
  pointsPrize: number;
  content: any[];
  userId: number;
};

export type State = {
  description: string | undefined;
  isComplete: boolean | undefined;
};

class PostCreate extends Component<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {
      description: undefined,
      isComplete: undefined
    };

    this.handleSolveChallenge = this.handleSolveChallenge.bind(this);
  }

  public componentDidMount() {
    const content = this.props.content;
    let description = "";

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < content.length; i++) {
      if (content[i].startsWith("Description: ")) {
        description = content[i].split("Description: ")[1];
      }
    }

    this.apiSolvedState(description);
  }

  public apiSolvedState(description: string) {
    let getUrl = `${location.protocol}//${location.hostname}`;
    getUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    getUrl += `/talk/${this.props.talkID}/challenge/solvedState`;

    axiosInstance
      .get(getUrl, {
        params: {
          author: this.props.userId,
          challenge: this.props.id
        }
      })
      .then(res => {
        let isComplete: boolean | undefined;
        const state = res.data.state;
        if (state.length > 0) {
          isComplete = res.data.state[0].complete;
        }
        this.setState({
          description,
          isComplete
        });
      })
      .catch(() => {
        console.log("Failed to get state of challenge");
        this.setState({
          description
        });
      });
  }

  public render() {
    return (
      <div className="card">
        <div className="card-header d-flex flex-row" id="challenge-header">
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
    const content = this.props.content;
    let description = "";

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < content.length; i++) {
      if (content[i].startsWith("Description: ")) {
        description = content[i].split("Description: ")[1];
      }
    }

    return (
      <div className={this.getInputRequiredStyle()}>
        <h6 className="card-title">
          {dictionary.create_post_chal[this.context]}
        </h6>
        <p className="card-body">{description}</p>
      </div>
    );
  }

  public getInputRequiredStyle() {
    let css = `${styles.normal}`;

    if (this.state.isComplete === true) {
      css = `${styles.correct_answer}`;
    } else if (this.state.isComplete === false) {
      css = `${styles.wrong_answer}`;
    }

    return css;
  }

  public getButtonRequiredClass() {
    return this.state.isComplete !== undefined ? true : false;
  }

  public handleSolveChallenge() {
    let getUrl = `${location.protocol}//${location.hostname}`;
    getUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    getUrl += `/talk/${this.props.talkID}/user/${this.props.userId}/posts`;

    axiosInstance
      .get(getUrl)
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ isComplete: true });
          this.apiSolveChallenge(true);
        }
      })
      .catch(() => {
        console.log("Failed to get comments of post refered on challenge");
      });
  }

  public apiSolveChallenge(complete: boolean) {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += `/talk/${this.props.talkID}/challenge/solve`;

    axiosInstance
      .post(postUrl, {
        author: this.props.userId,
        challenge: this.props.id,
        challenge_answer: "",
        completion: complete,
        headers: {}
      })
      .then(res => {
        console.log("Challenge solved - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
  }
}

export default PostCreate;

import axios from "axios";

// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./Challenge.module.css";

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
  description: string | undefined;
  postToComment: number;
  isComplete: boolean | undefined;
  titlePost: string | undefined;
};

class CommentPost extends Component<Props, State> {
  public static contextType = LanguageContext;

  public static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {
      description: undefined,
      isComplete: undefined,
      postToComment: 0,
      titlePost: ""
    };

    this.handleSolveChallenge = this.handleSolveChallenge.bind(this);
  }

  public componentDidMount() {
    const content = this.props.content;
    let description = "";
    let postToComment = 0;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < content.length; i++) {
      if (content[i].startsWith("Description: ")) {
        description = content[i].split("Description: ")[1];
      } else if (content[i].startsWith("PostToComment: ")) {
        postToComment = Number(content[i].split("PostToComment: ")[1]);
      }
    }

    this.apiSolvedState(description, postToComment);
  }

  public apiSolvedState(description: string, postToComment: number) {
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
          post: postToComment
        }
      })
      .then(res => {
        let isComplete: boolean | undefined;
        let titlePost: string | undefined = "";

        const state = res.data.state;
        if (state.length > 0) {
          isComplete = res.data.state[0].complete;
        }

        if (res.data.title !== undefined) {
          titlePost = res.data.title;
        }
        this.setState({
          description,
          isComplete,
          postToComment,
          titlePost
        });
      })
      .catch(() => {
        console.log("Failed to get state of challenge");
        this.setState({
          description,
          postToComment
        });
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

    if (this.props.prize === "points") {
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
    const title: any[] = [];
    if (this.state.description !== undefined || this.state.description !== "") {
      title.push(
        <h6 key={"Desc_Challenge_" + this.props.id} className="card-title">
          {" "}
          {this.state.description}{" "}
        </h6>
      );
    }

    return (
      <div className={this.getInputRequiredStyle()}>
        {title}
        <p className="card-text">
          {" "}
          {dictionary.comment_on_post[this.context]} "{this.state.titlePost}".
        </p>
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
    if (this.apiGetPostCommentChallenge()) {
      this.apiSolveChallenge();
    }
  }

  public apiGetPostCommentChallenge() {
    let commented: boolean = false;

    let getUrl = `${location.protocol}//${location.hostname}`;
    getUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    getUrl += `/conference/${this.props.confId}/post/${
      this.state.postToComment
    }/comments_author`;

    axios
      .get(getUrl, { params: { author: 1 } })
      .then(res => {
        const comments = res.data;
        comments === [] ? (commented = true) : (commented = false);
        this.setState({ isComplete: commented });
      })
      .catch(() => {
        console.log("Failed to get comments of post refered on challenge");
        commented = false;
      });

    return commented;
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
        challenge_answer: "",
        completion: this.state.isComplete ? true : false,
        headers: {}
      })
      .then(res => {
        console.log("Challenge solved - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
  }
}

export default CommentPost;

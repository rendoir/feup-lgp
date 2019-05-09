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
  description: string | undefined;
  postToComment: number;
};

class CommentPost extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {
      description: undefined,
      postToComment: 0
    };
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

      this.setState({ postToComment, description });
    }
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
      <div>
        {title}
        <p className="card-text">
          {" "}
          Comment On Post {this.state.postToComment}.
        </p>
        {/* TODO: Get Title of Post to Comment */}
      </div>
    );
  }

  public solveChallenge() {
    return null;
  }
}

export default CommentPost;

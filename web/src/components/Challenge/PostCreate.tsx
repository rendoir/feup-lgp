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

export type State = {};

class PostCreate extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
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
    let description = "";

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < content.length; i++) {
      if (content[i].startsWith("Description: ")) {
        description = content[i].split("Description: ")[1];
      }
    }

    return (
      <div>
        <h6 className="card-title"> {description} </h6>
      </div>
    );
  }

  public solveChallenge() {
    return null;
  }
}

export default PostCreate;

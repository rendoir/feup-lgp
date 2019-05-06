// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./ChallengeCarousel.module.css";

// - Import app components
import Conference from "../../views/Conference";
import Challenge from "../Challenge/Challenge";

export type Props = {
  id: number;
  challenges: any[];
  parent: Conference;
  handleChallengeClick: (challenge: Challenge | undefined) => any;
};

export type State = {};

class ChallengeCarousel extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const carousel = this.getCarousel();
    return <div>{carousel}</div>;
  }

  private getCarousel() {
    const challenges: any[] = [];
    const items: any[] = [];

    for (let i = 0; i < this.props.challenges.length; i++) {
      items.push(
        <li
          key={"li_" + this.props.id + "_" + i}
          data-target={"#challengeCarousel" + this.props.id}
          data-slide-to={i}
          className={i ? "" : "active"}
        />
      );
      challenges.push(
        <div
          key={"div_" + this.props.id + "_" + i}
          className={"carousel-item " + (i ? "" : "active")}
        >
          <div
            className={styles.post_content_media}
            onClick={this.props.handleChallengeClick.bind(
              this.props.parent,
              this.props.challenges[i]
            )}
          >
            <Challenge
              id={this.props.challenges[i].id}
              title={this.props.challenges[i].title}
              challengeType={this.props.challenges[i].challengetype}
              datestart={this.props.challenges[i].datestart}
              dateend={this.props.challenges[i].dateend}
              prize={this.props.challenges[i].prize}
              pointsPrize={Number(this.props.challenges[i].points_prize)}
              content={this.props.challenges[i].content}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        id={"imgCarousel" + this.props.id}
        className="carousel slide"
        data-ride="carousel"
        data-interval="false"
      >
        <ol className="carousel-indicators">{items}</ol>
        <div className="carousel-inner">{challenges}</div>
        <a
          className="carousel-control-prev"
          href={"#challengeCarousel" + this.props.id}
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href={"#challengeCarousel" + this.props.id}
          role="button"
          data-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </a>
      </div>
    );
  }
}

export default ChallengeCarousel;

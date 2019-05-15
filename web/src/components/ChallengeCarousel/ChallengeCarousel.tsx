// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./ChallengeCarousel.module.css";

// - Import app components
import Challenge from "../Challenge/Challenge";

export type Props = {
  id: number;
  challenges: any[];
  userId: number;
  handleChallengeClick: (challenge: number | undefined) => any;
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
            className="post_content_media"
            onClick={this.props.handleChallengeClick.bind(
              this,
              this.props.challenges[i].id
            )}
          >
            <Challenge
              confId={this.props.id}
              id={this.props.challenges[i].id}
              title={this.props.challenges[i].title}
              challengeType={this.props.challenges[i].challengetype}
              datestart={this.props.challenges[i].datestart}
              dateend={this.props.challenges[i].dateend}
              prize={this.props.challenges[i].prize}
              pointsPrize={Number(this.props.challenges[i].points_prize)}
              content={this.props.challenges[i].content}
              userId={this.props.userId}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        id={"challengeCarousel" + this.props.id}
        className="carousel slide"
        data-ride="carousel"
        data-interval="false"
      >
        <div className="carousel-inner challenge">{challenges}</div>
        <a
          className={`carousel-control-prev ${styles.carousel_control_prev}`}
          href={"#challengeCarousel" + this.props.id}
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a
          className={`carousel-control-next ${styles.carousel_control_next}`}
          href={"#challengeCarousel" + this.props.id}
          role="button"
          data-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </a>
        <ol className={`carousel-indicators ${styles.carousel_indicators}`}>
          {items}
        </ol>
      </div>
    );
  }
}

export default ChallengeCarousel;

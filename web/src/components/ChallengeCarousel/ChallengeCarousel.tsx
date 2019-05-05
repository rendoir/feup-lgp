// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Post/Post.module.css";

// - Import app components
import Conference from "../../views/Conference";
import Challenge from "../Challenge/Challenge";

export type Props = {
  id: number;
  challenges: Challenge[];
  parent: Conference;
  handleImageClick: (image: string | undefined) => any;
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
          data-target={"#imgCarousel" + this.props.id}
          data-slide-to={i}
          className={i ? "" : "active"}
        />
      );
      /*challenges.push(
        <div
          key={"div_" + this.props.id + "_" + i}
          className={"carousel-item " + (i ? "" : "active")}
        >
          <div
            className={styles.post_content_media}
            onClick={this.props.handleImageClick.bind(
              this.props.parent,
              this.props.challenges[i].src
            )}
          >
            <img src={this.props.challenges[i].src} />
          </div>
        </div>
      );*/
    }

    return (
      <div
        id={"imgCarousel" + this.props.id}
        className="carousel slide"
        data-ride="carousel"
        data-interval="false"
      >
        {/*<ol className="carousel-indicators">{items}</ol>
        <div className="carousel-inner">{challenges}</div>
        <a
          className="carousel-control-prev"
          href={"#imgCarousel" + this.props.id}
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href={"#imgCarousel" + this.props.id}
          role="button"
          data-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
    </a>*/}
      </div>
    );
  }
}

export default ChallengeCarousel;

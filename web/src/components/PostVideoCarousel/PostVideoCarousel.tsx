// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Post/Post.module.css";

// - Import app components
import Post from "../Post/Post";

type MyFile = {
  name: string;
  mimetype: string;
  src?: string;
  size: number;
};

export type Props = {
  id: number;
  videos: MyFile[];
};

export type State = {};

class PostVideoCarousel extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const carousel = this.getCarousel();

    return <div>{carousel}</div>;
  }

  private getCarousel() {
    const videos = [];
    const items = [];

    for (let i = 0; i < this.props.videos.length; i++) {
      items.push(
        <li
          key={"li_" + this.props.id + "_" + i}
          data-target={"#videoCarousel" + this.props.id}
          data-slide-to={i}
          className={i ? "" : "active"}
        />
      );
      videos.push(
        <div
          key={"div_" + this.props.id + "_" + i}
          className={"carousel-item " + (i ? "" : "active")}
        >
          <div className={styles.post_content_media}>
            <video src={this.props.videos[i].src} controls={true} />
          </div>
        </div>
      );
    }

    return (
      <div
        id={"videoCarousel" + this.props.id}
        className={"carousel slide " + styles.post_video_carousel}
        data-ride="carousel"
        data-interval="false"
      >
        <ol className="carousel-indicators">{items}</ol>
        <div className="carousel-inner">{videos}</div>
        <a
          className="carousel-control-prev"
          href={"#videoCarousel" + this.props.id}
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href={"#videoCarousel" + this.props.id}
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

export default PostVideoCarousel;

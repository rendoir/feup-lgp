// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Post/Post.module.css";

// - Import app components
import Post from "../Post/Post";

export type Props = {
  id: Number;
  images: string[];
  parent: Post;
  handleImageClick: (image: string) => any;
};

export type State = {};

class PostCarousel extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  private getCarousel() {
    let images = [];
    let items = [];

    for (let i = 0; i < this.props.images.length; i++) {
      items.push(
        <li
          data-target={"#imgCarousel" + this.props.id}
          data-slide-to={i}
          className={i ? "" : "active"}
        />
      );
      images.push(
        <div className={"carousel-item " + (i ? "" : "active")}>
          <div
            className={styles.post_content_media}
            onClick={this.props.handleImageClick.bind(
              this.props.parent,
              this.props.images[i]
            )}
          >
            <img src={this.props.images[i]} />
          </div>
        </div>
      );
    }

    return (
      <div
        id={"imgCarousel" + this.props.id}
        className="carousel slide"
        data-ride="carousel"
      >
        <ol className="carousel-indicators">{items}</ol>
        <div className="carousel-inner">{images}</div>
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
        </a>
      </div>
    );
  }

  public render() {
    let carousel = this.getCarousel();

    return <div>{carousel}</div>;
  }
}

export default PostCarousel;

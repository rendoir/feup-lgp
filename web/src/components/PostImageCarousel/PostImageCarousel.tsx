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
  images: MyFile[];
  parent: Post;
  handleImageClick: (image: string | undefined) => any;
};

export type State = {};

class PostImageCarousel extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const carousel = this.getCarousel();

    return <div>{carousel}</div>;
  }

  private getCarousel() {
    const images: any[] = [];
    const items: any[] = [];

    for (let i = 0; i < this.props.images.length; i++) {
      items.push(
        <li
          key={"li_" + this.props.id + "_" + i}
          data-target={"#imgCarousel" + this.props.id}
          data-slide-to={i}
          className={i ? "" : "active"}
        />
      );
      images.push(
        <div
          key={"div_" + this.props.id + "_" + i}
          className={"carousel-item " + (i ? "" : "active")}
        >
          <div
            className={styles.post_content_media}
            onClick={this.props.handleImageClick.bind(
              this.props.parent,
              this.props.images[i].src
            )}
          >
            <img src={this.props.images[i].src} />
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
}

export default PostImageCarousel;

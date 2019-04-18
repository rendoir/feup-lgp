import classNames from "classnames";
import React, { Component } from "react";

import createSequence from "../../utils/createSequence";

import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import styles from "./Post.module.css";

import Avatar from "../Avatar/Avatar";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
// import VideoPreloader from "../VideoPreloader/VideoPreloader";

export type Props = {
  hasImage: boolean;
  image: string | undefined;

  hasVideo: boolean;
  video: string | undefined;

  author: string;

  text: string | undefined;

  comments: undefined;
};

export type State = {};

const seq = createSequence();

class Post extends Component<Props, State> {
  id: string;

  static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.id = "post_" + seq.next();
    this.state = {
      isHovered: false
    };
  }

  render() {
    const className = classNames(styles.container);
    /*
      this.props.className,
      this.state.isHovered ? styles.hovered : null
    */

    const hasImage = this.props.hasImage;
    const hasVideo = this.props.hasVideo;
    let imgDiv;
    let videoDiv;

    if (hasImage) {
      imgDiv = (
        <div className={styles.post_content}>
          <ImagePreloader src={this.props.image}>
            {({ src }) => {
              return <img src={src} />;
            }}
          </ImagePreloader>
        </div>
      );
    }

    if (hasVideo) {
      videoDiv = (
        <div className={styles.post_content}>
          <iframe
            src={this.props.video}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
          />
        </div>
      );
    }

    return (
      <div className={`${styles.post} mb-4`}>
        <div className={styles.post_header}>
          <Avatar
            title={this.props.author}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <p className={styles.post_author}> {this.props.author} </p>
          <p className={styles.post_date}>20-02-2019</p>
          <div className={`${styles.post_options} btn-group`}>
            <a className="btn" data-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <button className="dropdown-item" type="button">
                Edit Post
              </button>
              <button className="dropdown-item" type="button">
                Delete Post
              </button>
              <button className="dropdown-item" type="button">
                etc
              </button>
            </div>
          </div>
        </div>
        <div className={styles.post_content}>
          <p> {this.props.text} </p>
        </div>
        {imgDiv}
        {videoDiv}
        <div className={styles.post_stats}>
          <span>35 likes</span>
          <span>14 comments</span>
        </div>
        <div className={styles.post_actions}>
          <button>
            <i className="fas fa-thumbs-up" />
            <span>Like</span>
          </button>
          <button>
            <i className="far fa-comment-alt" />
            <span>Comment</span>
          </button>
          <button>
            <i className="fas fa-share-square" />
            <span>Share</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Post;

import React, { Component } from "react";
import classNames from "classnames";

import createSequence from "../../utils/createSequence";

import styles from "./Post.module.css";
import Avatar from "../Avatar/Avatar";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

export type Props = {
  content_width: number;
  content_height: number;

  hasImage: boolean;
  image: string | undefined;

  hasVideo: boolean;
  video: string | undefined;

  author: string;

  text: string | undefined;
  text_height: number;
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
    const { content_width } = this.props;
    const { content_height } = this.props;
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
        <div className="post-content">
          <ImagePreloader src={this.props.image}>
            {({ src }) => {
              return (
                <img
                  src={src}
                  width={content_width}
                  height={content_height - this.props.text_height}
                />
              );
            }}
          </ImagePreloader>
        </div>
      );
    }

    if (hasVideo) {
      videoDiv = (
        <div className="post-content">
          <VideoPreloader src={this.props.video}>
            {({ src }) => {
              return (
                <iframe
                  src={src}
                  width={content_width}
                  height={content_height - this.props.text_height}
                />
              );
            }}
          </VideoPreloader>
        </div>
      );
    }

    return (
      <div
        className={`${styles.post} mb-4`}
        style={{ width: content_width, height: content_height + 139 }}
      >
        <div className={styles.post_header}>
          <Avatar
            title={this.props.author}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <p className={styles.post_author}> {this.props.author} </p>
          <p className={styles.post_date}>20-02-2019</p>
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
      </div>
    );
  }
}

export default Post;

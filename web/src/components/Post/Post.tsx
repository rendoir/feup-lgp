// - Import react components
import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// - Import styles
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "@fortawesome/fontawesome-free/css/all.css";

import styles from "./Post.module.css";

// - Import app components
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

import createSequence from "../../utils/createSequence";

const seq = createSequence();

export type Props = {
  title: string;

  //postAuthor?: ;
  //post: [] | undefined;

  content_width: number;

  hasImage: boolean;
  image: string | undefined;
  image_height: number;

  hasVideo: boolean;
  video: string | undefined;
  video_height: number;

  author: string;

  text: string | undefined;
  text_height: number;

  comments: Array<any>;
};

export type State = {};

class Post extends Component<Props, State> {
  id: string;

  static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.id = "post_" + seq.next();
    this.state = {
      isHovered: false
    };

    this.handleEditPost = this.handleEditPost.bind(this);
  }

  getData() {
    setTimeout(() => {
      console.log("Our data is fetched");
      this.setState({
        data: "Hello WallStreet"
      });
    }, 1000);
  }

  componentDidMount() {
    this.getData();
  }

  handleEditPost() {
    console.log("EDIT POST");
  }

  handleDeletePost() {
    console.log("DELETE POST");
  }

  createCommentsSection = () => {
    let commentsSection = [];

    for (var i = 0; i < this.props.comments.length; i++) {
      commentsSection.push(
        <Comment
          title=""
          author={this.props.comments[i].author}
          text={this.props.comments[i].text}
        />
      );
    }

    return <div className={styles.post_comments}>{commentsSection}</div>;
  };

  render() {
    const { content_width } = this.props;
    const content_height = this.props.text_height + this.props.image_height;
    +this.props.video_height;

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
              return (
                <img
                  src={src}
                  width={content_width}
                  height={this.props.image_height}
                />
              );
            }}
          </ImagePreloader>
        </div>
      );
    }

    /* VIDEO PRELOADER CODE
          <VideoPreloader src={this.props.video}>
            {({ src }) => {
              return (
                <iframe
                  src={src}
                  width={content_width}
                  height={this.props.video_height}
                />
              );
            }}
          </VideoPreloader>
      */

    if (hasVideo) {
      videoDiv = (
        <div className={styles.post_content}>
          <iframe
            width={this.props.content_width}
            height={this.props.video_height}
            src={this.props.video}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <div
        className={`${styles.post} mb-4`}
        style={{ width: content_width, height: content_height }}
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
          <div className={`${styles.post_options_button_grp} btn-group`}>
            <a role="button" data-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <button
                className="dropdown-item"
                type="button"
                onClick={this.handleEditPost}
              >
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
        {this.props.image != undefined && imgDiv}
        {this.props.video != undefined && videoDiv}
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
        <div className={styles.post_comment_section}>
          {this.createCommentsSection()}
          <div className={styles.post_add_comment}>
            <Avatar
              title={this.props.author}
              placeholder="empty"
              size={30}
              image="https://picsum.photos/200/200?image=52"
            />
            <textarea
              className="form-control ml-4 mr-3"
              placeholder="Insert your comment..."
            />
            <button className={`${styles.submit_comment} px-2 py-1`}>
              <i className="fas fa-chevron-circle-right" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;

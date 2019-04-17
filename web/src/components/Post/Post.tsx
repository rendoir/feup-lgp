// - Import react components
import axios from "axios";
import classNames from "classnames";
import React, { Component } from "react";

// - Import styles
import styles from "./Post.module.css";

// - Import app components
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import DeleteModal from "../PostModal/DeleteModal";
import PostModal from "../PostModal/PostModal";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

interface Props {
  id: number;

  title: string;

  date: string | undefined;

  content_width: number;

  images: string[] | undefined;

  videos: string[] | undefined;

  author: string;

  text: string | undefined;

  comments: any[];
}

interface State {
  post_id: number;
  isHovered: boolean;
  commentValue: string;
}

class Post extends Component<Props, State> {
  public static defaultProps = {};
  public id: string;

  constructor(props: Props) {
    super(props);

    this.id = "post_" + this.props.id;
    this.state = {
      post_id: 0,
      isHovered: false,
      commentValue: ""
    };

    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.changeCommentValue = this.changeCommentValue.bind(this);
  }

  public componentDidMount() {
    this.setState({ post_id: this.props.id });
  }

  public handleDeletePost() {
    console.log("DELETE POST");
  }

  public changeCommentValue(event: any) {
    this.setState({ commentValue: event.target.value });
  }

  public handleAddComment() {
    this.apiComments();
  }

  public apiComments() {
    axios
      .post("https://localhost:8443/post/newcomment", {
        author: 1, //When loggin, this is the user logged in
        post: this.state.post_id,
        comment: this.state.commentValue,
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        console.log("Comment created - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public getCommentSection() {
    const commentSection = this.props.comments.map((comment, idx) => {
      return (
        <Comment
          key={idx}
          title={comment.id}
          author={comment.first_name + " " + comment.last_name}
          text={comment.comment}
        />
      );
    });

    return <div className={styles.post_comments}>{commentSection}</div>;
  }

  public getImages() {
    const imgDiv = [];

    if (this.props.images != null && this.props.images != undefined) {
      for (let i = 0; i < this.props.images.length; i++) {
        imgDiv.push(
          <div className={styles.post_content}>
            <ImagePreloader src={this.props.images[i]}>
              {({ src }) => {
                return <img src={src} width={this.props.content_width} />;
              }}
            </ImagePreloader>
          </div>
        );
      }
    }

    return imgDiv;
  }

  public getVideos() {
    const videoDiv = [];

    if (this.props.videos != null && this.props.videos != undefined) {
      for (let i = 0; i < this.props.videos.length; i++) {
        videoDiv.push(
          <div className={styles.post_content}>
            <iframe
              width={this.props.content_width}
              src={this.props.videos[i]}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={true}
            />
          </div>
        );
      }
    }

    return videoDiv;
  }

  public validComment() {
    return Boolean(this.state.commentValue);
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  public render() {
    const { content_width } = this.props;

    const className = classNames(styles.container);
    /*
    this.props.className,
    this.state.isHovered ? styles.hovered : null
    */

    return (
      <div className={`${styles.post} mb-4`} style={{ width: content_width }}>
        <div className={styles.post_header}>
          <Avatar
            title={this.props.author}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <p className={styles.post_author}> {this.props.author} </p>
          <p className={styles.post_date}>{this.props.date}</p>
          <div className={`${styles.post_options_button_grp} btn-group`}>
            <a role="button" data-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <button
                className="dropdown-item"
                type="button"
                data-toggle="modal"
                data-target="#post_modal_Edit"
              >
                Edit Post
              </button>
              <button
                className="dropdown-item"
                type="button"
                data-toggle="modal"
                data-target="#delete_post_modal"
              >
                Delete Post
              </button>
              <button className="dropdown-item" type="button">
                etc
              </button>
            </div>
          </div>
        </div>
        <div className={styles.post_content}>
          <h4> {this.props.title} </h4>
        </div>
        <div className={styles.post_content}>
          <p> {this.props.text} </p>
        </div>
        {this.getImages()}
        {this.getVideos()}
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
        {/* Post edition modal */}
        <PostModal {...this.props} />
        {/* Delete Post */}
        <DeleteModal {...this.props} />
        {/* Comment section*/}
        <div className={styles.post_comment_section}>
          {this.getCommentSection()}
          <form className={styles.post_add_comment}>
            <Avatar
              title={this.props.author}
              placeholder="empty"
              size={30}
              image="https://picsum.photos/200/200?image=52"
            />
            <textarea
              className={`form-control ml-4 mr-3 ${this.getInputRequiredClass(
                this.state.commentValue
              )}`}
              placeholder="Insert your comment..."
              value={this.state.commentValue}
              onChange={this.changeCommentValue}
              required={true}
            />
            <button
              className={`${styles.submit_comment} px-2 py-1`}
              type="submit"
              value="Submit"
              onClick={this.handleAddComment}
              disabled={!this.validComment()}
            >
              <i className="fas fa-chevron-circle-right" />
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Post;

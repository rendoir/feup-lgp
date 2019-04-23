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
import { throws } from "assert";

type Props = {
  id: number;

  title: string;

  date: string | undefined;

  images: string[] | undefined;

  videos: string[] | undefined;

  author: string;

  text: string | undefined;

  comments: any[];
};

interface State {
  post_id: number;

  commentValue: string;

  isHovered: boolean;

  activePage: number;
}

class Post extends Component<Props, State> {
  public static defaultProps = {};
  public id: string;

  constructor(props: Props) {
    super(props);

    this.id = "post_" + this.props.id;
    this.state = {
      post_id: 0,
      activePage: 1,
      isHovered: false,
      commentValue: ""
    };

    this.handleDeletePost = this.handleDeletePost.bind(this);

    this.handleAddComment = this.handleAddComment.bind(this);
    this.changeCommentValue = this.changeCommentValue.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  public componentDidMount() {
    this.setState({
      post_id: this.props.id,
      activePage: Math.ceil(this.props.comments.length / 5)
    });
  }

  public handleEditPost() {
    console.log("EDIT POST");
  }

  public apiComments() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/newcomment";

    axios
      .post(postUrl, {
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        },
        author: 1, //When loggin, this is the user logged in
        post: this.state.post_id,
        comment: this.state.commentValue
      })
      .then(res => {
        console.log("Comment created - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
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
    return (
      <div className={`${styles.post} mb-4`}>
        <div className={styles.post_header}>
          <Avatar
            title={this.props.author}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <a className={styles.post_author} href={"/user/" + this.props.author}>
            {" "}
            {this.props.author}
          </a>
          <a className={styles.post_date} href={"/post/" + this.props.id}>
            {this.props.date}
          </a>
          <div className={`${styles.post_options} btn-group`}>
            <button
              className="w-100 h-100 ml-2"
              role="button"
              data-toggle="dropdown"
            >
              <i className="fas fa-ellipsis-v" />
            </button>
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
          <ul className="pagination">{this.getPagination()}</ul>
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

  public handleDeletePost() {
    console.log("DELETE POST");
  }

  public changeCommentValue(event: any) {
    this.setState({ commentValue: event.target.value });
  }

  public handleAddComment() {
    this.apiComments();
  }

  public handlePageChange(event: any) {
    var target = event.target || event.srcElement;
    this.setState({ activePage: Number(target.innerHTML) });
  }

  public getCommentSection() {
    const indexOfLast = this.state.activePage * 5;
    const indexOfFirst = indexOfLast - 5;

    const currentComments = this.props.comments.slice(
      indexOfFirst,
      indexOfLast
    );
    const commentSection = currentComments.map((comment, idx) => {
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

  private getPagination() {
    if (this.props.comments.length < 6) return;

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.props.comments.length / 5); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          key={number}
          className="page-item"
          //id={number}
          onClick={this.handlePageChange}
        >
          <a className="page-link">{number}</a>
        </li>
      );
    });

    return renderPageNumbers;
  }

  private getImages() {
    const imgDiv = [];

    if (this.props.images) {
      // if exists
      for (const image of this.props.images) {
        imgDiv.push(
          <div className={styles.post_content}>
            <ImagePreloader src={image}>
              {({ src }) => {
                return <img src={src} width="100" />;
              }}
            </ImagePreloader>
          </div>
        );
      }
    }

    return imgDiv;
  }

  private getVideos() {
    const videoDiv = [];

    if (this.props.videos) {
      // if exists
      for (const video of this.props.videos) {
        videoDiv.push(
          <div className={styles.post_content}>
            <iframe
              width="100"
              src={video}
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
}

export default Post;

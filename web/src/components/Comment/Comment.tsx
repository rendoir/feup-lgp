// - Import react components
import axios from "axios";
// import classNames from "classnames";

import Avatar from "../Avatar/Avatar";

import React, { Component } from "react";

// - Import style
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import styles from "./../Post/Post.module.scss";

export type Props = {
  // comment: Comment //from model (substitutes title, text)
  title: string | undefined;
  text: string | undefined;

  author: string | undefined;
  likes: number;

  secondLevel: boolean;
};

export type State = {
  commentID: number;
  commentValue: string;
  comments: any[];
  hrefComment: string;
  isHovered: boolean;
  redirect: boolean;
};

class Comment extends Component<Props, State> {
  public static defaultProps = {};
  public id: string;

  constructor(props: Props) {
    super(props);

    this.id = "comment_" + this.props.title;
    this.state = {
      commentID: 0,
      commentValue: "",
      comments: [],
      hrefComment: "",
      isHovered: false,
      redirect: false
    };

    this.handleCommentDeletion = this.handleCommentDeletion.bind(this);

    this.handleAddComment = this.handleAddComment.bind(this);
    this.changeCommentValue = this.changeCommentValue.bind(this);

    this.handleAddLike = this.handleAddLike.bind(this);
  }

  public render() {
    return (
      <div className={`${styles.post_comment} my-3`}>
        <div className={styles.comment_header}>
          <Avatar
            title={this.props.author}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <div>
            <div className={styles.comment_text}>
              <p>
                <span className={styles.post_author}>{this.props.author}</span>
                {this.props.text}
                {this.getLikes()}
              </p>
            </div>
            <div className={styles.comment_social}>
              <button
                className={styles.comment_action}
                onClick={this.handleAddLike}
              >
                Like
              </button>
              {!this.props.secondLevel && (
                <button
                  className={styles.comment_action}
                  role="button"
                  data-toggle="collapse"
                  data-target={"#" + this.state.hrefComment + "_form"}
                >
                  Reply
                </button>
              )}
              <a className={styles.post_date} href={"/post/" + this.id} />
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
                    data-target="#edit_comment_modal"
                  >
                    Edit Comment
                  </button>
                  <button
                    className="dropdown-item"
                    type="button"
                    data-toggle="modal"
                    data-target={`#delete_comment_modal_${this.props.title}`}
                  >
                    Delete Comment
                  </button>
                </div>
              </div>
              <div className={`${styles.post_comment_section} w-100`}>
                {this.actionRenderLevelComments()}
                <div className={`${styles.post_comment} w-100`}>
                  {this.renderLevelComments()}
                  <div
                    id={this.state.hrefComment + "_form"}
                    className="collapse"
                  >
                    <form
                      className={styles.post_add_comment}
                      onSubmit={this.handleAddComment}
                    >
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
                        disabled={!this.validComment()}
                      >
                        <i className="fas fa-chevron-circle-right" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id={`delete_comment_modal_${this.props.title}`}
          className="modal fade"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle" />
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want do delete this comment? It can't be
                  retrieved later.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                {this.getActionButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.setState({
      commentID: Number(this.props.title),
      hrefComment: "comment_section_" + this.props.title
    });
    this.apiGetCommentsOfComment(Number(this.props.title));
  }

  public handleAddComment(event: any) {
    event.preventDefault();
    this.apiComments();
  }

  public apiComments() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/comment/newcomment";

    axios
      .put(postUrl, {
        author: 1, // When loggin, this is the user logged in
        comment: this.state.commentValue,
        comment_id: this.state.commentID,
        headers: {}
      })
      .then(res => {
        console.log("Comment created - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public changeCommentValue(event: any) {
    this.setState({ commentValue: event.target.value });
  }

  public handleAddLike(event: any) {
    event.preventDefault();
    this.apiAddLikeToComment();
  }

  public apiGetCommentsOfComment(id: number) {
    let getUrl = `${location.protocol}//${location.hostname}`;
    getUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    getUrl += "/post/comments/";
    getUrl += id;

    axios
      .get(getUrl)
      .then(res => {
        console.log("Comment created - reloading page...");
        this.setState({
          comments: res.data
        });
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public apiAddLikeToComment() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/comments/";
    postUrl += this.state.commentID;
    postUrl += "/like";

    axios
      .post(postUrl, {
        author: 1,
        headers: {}
      })
      .then(res => {
        console.log("Comment liked - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to add like to comment"));
  }

  public apiDeleteComment() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/deletecomment";
    axios
      .delete(postUrl, {
        data: {
          id: this.props.title
        },
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        console.log("Comment deleted");
        if (window.location.pathname === "/post/" + this.id) {
          this.setState({
            redirect: true
          });
          this.handleRedirect();
        } else {
          window.location.reload();
        }
      })
      .catch(() => console.log("Failed to delete comment"));
  }

  public handleCommentDeletion() {
    this.apiDeleteComment();
  }

  public renderRedirect() {
    if (this.state.redirect) {
      window.location.href = "/";
    }
  }

  public handleRedirect() {
    if (window.location.pathname === "/post/" + this.id) {
      this.renderRedirect();
    }
  }

  public getActionButton() {
    return (
      <div>
        {this.handleRedirect()}
        <button
          type="button"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={this.handleCommentDeletion}
        >
          {"Yes"}
        </button>
      </div>
    );
  }

  public getLikes() {
    const likesDiv = [];
    if (this.props.likes > 0) {
      likesDiv.push(
        <span className={styles.comment_detail}>
          <i className="fas fa-thumbs-up" /> {this.props.likes}
        </span>
      );
    }
    return likesDiv;
  }

  public renderLevelComments() {
    const commentSection = this.state.comments.map((comment, idx) => {
      return (
        <Comment
          key={"comment" + this.props.title + " " + idx}
          title={comment.id}
          author={comment.first_name + " " + comment.last_name}
          text={comment.comment}
          likes={comment.likes}
          secondLevel={true}
        />
      );
    });

    return (
      <div id={this.state.hrefComment} className="w-100 collapse">
        {commentSection}
      </div>
    );
  }

  public actionRenderLevelComments() {
    const actionSeeRepliesDiv = [];

    if (this.state.comments.length > 0) {
      actionSeeRepliesDiv.push(
        <button
          className={styles.comment_action}
          role="button"
          data-toggle="collapse"
          data-target={"#" + this.state.hrefComment}
        >
          See {this.state.comments.length} Replies
        </button>
      );
    }

    return actionSeeRepliesDiv;
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
}

export default Comment;

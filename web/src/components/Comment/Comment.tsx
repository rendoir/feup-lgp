// - Import react components
import axios from "axios";
// import classNames from "classnames";
import createSequence from "../../utils/createSequence";

import Avatar from "../Avatar/Avatar";

import React, { Component } from "react";

// - Import style
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import styles from "./../Post/Post.module.scss";

const seq = createSequence();

export type Props = {
  // comment: Comment //from model (substitutes title, text)
  title: string | undefined;
  text: string | undefined;

  author: string | undefined;
};

export type State = {};

class Comment extends Component<Props, State> {
  public static defaultProps = {};
  public id: string;

  constructor(props: Props) {
    super(props);

    this.id = "comment_" + seq.next();
    this.state = {
      isHovered: false
    };

    this.handleCommentDeletion = this.handleCommentDeletion.bind(this);
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
          id: this.id
        },
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        console.log("Comment deleted");
      })
      .catch(() => console.log("Failed to delete comment"));
  }

  public handleCommentDeletion() {
    this.apiDeleteComment();
  }

  public getActionButton() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        data-dismiss="modal"
        onClick={this.handleCommentDeletion}
      >
        {"Yes"}
      </button>
    );
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
              </p>
              <span className={styles.comment_detail}>
                <i className="fas fa-thumbs-up" />2
              </span>
            </div>
            <div className={styles.comment_social}>
              <button className={styles.comment_action}>Like</button>
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
                    data-target="#delete_comment_modal"
                  >
                    Delete Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="delete_comment_modal"
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
}

export default Comment;

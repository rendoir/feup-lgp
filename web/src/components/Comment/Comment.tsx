// - Import react components
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { Component } from "react";

// - Import style
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import styles from "./../Post/Post.module.scss";

// - Import app components
import Avatar from "../Avatar/Avatar";

import createSequence from "../../utils/createSequence";

const seq = createSequence();

export interface Props {
  // comment: Comment //from model (substitutes title, text)
  title: string | undefined;
  text: string | undefined;

  author: string | undefined;
  // date: string;

  /*
  openEditor?: Function; //Open profile editor
  closeEditor?: () => any; //Close comment editor

  isCommentOwner?: boolean; //Current user is comment owner {true} or not {false}
  isPostOwner: boolean; //Current user is post owner {true} or not {false}

  update?: (comment: Comment) => any; //Update comment
  delete?: (id?: string | null, postId?: string) => any; //Delete comment

  getUserInfo?: () => void; //Get user profile

  fullName?: string; //User full name
  avatar?: string; //User avatar address

  disableComments?: boolean; //Writing comment on the post is disabled {true} or not false
  editorStatus: boolean; //Whether comment edit is open

  classNames?: any; //Styles

  translate?: (state: any) => any; //Translate to locale string

  onClick?: (event: MouseEvent) => unknown;
  */
}

export interface State {
  /*
  initialText?: string; //Initial text comment
  text: string; //Initial text comment

  editDisabled: boolean; //Comment is in edit state {true} or not {false}
  isPostOwner: boolean; //Current user is the post owner {true} or not falses

  display?: boolean; //Display comment {true} or not {false}
  openMenu?: boolean; //Whether comment menu is open
  anchorEl: any; //Anchor element
  */
}

class Comment extends Component<Props, State> {
  public static defaultProps = {};
  public id: string;

  constructor(props: Props) {
    super(props);

    this.id = "comment_" + seq.next();
    this.state = {
      isHovered: false
    };
  }

  public render() {
    const className = classNames(styles.container);

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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;

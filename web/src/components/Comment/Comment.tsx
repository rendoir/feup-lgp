// - Import react components
import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// - Import app components
import Avatar from "../Avatar/Avatar";

// - Import API

// - Import actions

import createSequence from "../../utils/createSequence";

// - Import style
import styles from "./../Post/Post.module.css";

export type Props = {
  //comment: Comment //from model (substitutes title, text)
  title: string | undefined;
  text: string | undefined;

  author: string | undefined;
  date: string;

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
};

export type State = {
  initialText?: string; //Initial text comment
  text: string; //Initial text comment

  editDisabled: boolean; //Comment is in edit state {true} or not {false}
  isPostOwner: boolean; //Current user is the post owner {true} or not falses

  display?: boolean; //Display comment {true} or not {false}
  openMenu?: boolean; //Whether comment menu is open
  anchorEl: any; //Anchor element
};

class Comment extends Component<Props, State> {}

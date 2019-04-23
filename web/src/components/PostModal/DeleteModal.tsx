import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import createSequence from "../../utils/createSequence";

import "./PostModal.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import { checkPropTypes } from "prop-types";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

const CREATE_MODE = "Create";
const DELETE_MODE = "Delete";

interface IProps {
  /* The following attributes are only required for post deletion */
  id?: number;
  title?: string;
  text?: string;

  images?: string[];
  videos?: string[];
}

interface IState {
  title: string;
  text: string;
  redirect: boolean;
}

const seq = createSequence();

class DeleteModal extends Component<IProps, IState> {
  public mode: string;

  public image: any = React.createRef();
  public video: any = React.createRef();

  constructor(props: IProps) {
    super(props);

    this.mode = props.id ? DELETE_MODE : CREATE_MODE;

    this.state = {
      // Post title and text are stored in state so that we can have a dynamic design on their respective input fields
      text: props.text || "",
      title: props.title || "",
      redirect: false
    };

    // Post manipulation handlers
    this.handlePostCreation = this.handlePostCreation.bind(this);
    this.handlePostDeletion = this.handlePostDeletion.bind(this);
    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public apiCreatePost() {
    // TODO: call api to create post
  }

  public apiDeletePost() {
    this.setState({
      redirect: true
    });
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/delete";
    axios
      .delete(postUrl, {
        data: {
          id: this.props.id
        },
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        console.log("Post deleted - reloading page");
        window.location.reload();
      })
      .catch(() => console.log("Failed to delete post"));
  }

  public handlePostCreation() {
    this.apiCreatePost();
  }

  public handlePostDeletion() {
    this.apiDeletePost();
  }

  public renderRedirect() {
    if (this.state.redirect) return <Redirect to={"/"} />;
  }

  public handleInputChange(event: any) {
    const field = event.target.name;
    const value = !event.target.value.replace(/\s/g, "").length
      ? ""
      : event.target.value; // Ignore input only containing white spaces

    const partialState: any = {};
    partialState[field] = value;
    this.setState(partialState);
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  public getActionButton() {
    return (
      <div>
        {this.renderRedirect()}
        <button
          type="button"
          className="btn btn-primary"
          data-dismiss="modal"
          onClick={this.handlePostDeletion}
        >
          {"Yes"}
        </button>
      </div>
    );
  }

  public render() {
    // const className = classNames(styles.container);

    return (
      <div
        id="delete_post_modal"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
        data-backdrop="false"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                {`${this.mode} Post`}
              </h5>
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
                Are you sure you want do delete this post? It can't be retrieved
                later.
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
    );
  }
}

export default DeleteModal;

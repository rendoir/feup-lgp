import axios from "axios";
import React, { Component } from "react";

import createSequence from "../../utils/createSequence";

import "./PostModal.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import { checkPropTypes } from "prop-types";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

const CREATE_MODE = "Create";
const EDIT_MODE = "Edit";

interface IProps {
  /* The following attributes are only required for post edition */
  id?: number;
  title?: string;
  text?: string;

  images?: string[];
  videos?: string[];
}

interface IState {
  title: string;
  text: string;
}

const seq = createSequence();

class PostModal extends Component<IProps, IState> {
  public mode: string;

  public image: any = React.createRef();
  public video: any = React.createRef();

  constructor(props: IProps) {
    super(props);

    this.mode = props.id ? EDIT_MODE : CREATE_MODE;

    this.state = {
      // Post title and text are stored in state so that we can have a dynamic design on their respective input fields
      text: props.text || "",
      title: props.title || ""
    };

    // Post manipulation handlers
    this.handlePostCreation = this.handlePostCreation.bind(this);
    this.handlePostEdition = this.handlePostEdition.bind(this);
    this.handlePostCancel = this.handlePostCancel.bind(this);
    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public handlePostCancel() {
    // Reset field values
    this.setState({
      text: this.props.text || "",
      title: this.props.title || ""
    });
  }

  public apiCreatePost() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/create";
    axios
      .post(postUrl, {
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        },
        // tslint:disable-next-line:object-literal-sort-keys
        author: 1, // This is the logged in user
        text: this.state.text,
        title: this.state.title
      })
      .then(res => {
        console.log("Post created - reloading page...");
        window.location.href = "/post/" + res.data.id[0].id;
      })
      .catch(() => console.log("Failed to create post"));
  }

  public apiEditPost() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/edit";
    axios
      .post(postUrl, {
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        },
        id: this.props.id,
        text: this.state.text,
        title: this.state.title
      })
      .then(res => {
        console.log("Post edited - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to edit post"));
  }

  public validPost() {
    return Boolean(this.state.title && this.state.text);
  }

  public handlePostCreation() {
    this.apiCreatePost();
  }

  public handlePostEdition() {
    this.apiEditPost();
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

  public getPostForm() {
    return (
      <form className="was-validated">
        <div className="mb-3">
          <h5>Title</h5>
          <input
            name="title"
            type="text"
            className={this.getInputRequiredClass(this.state.title)}
            onChange={this.handleInputChange}
            placeholder="Insert title"
            value={this.state.title}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.title)}
          >
            Title must be provided
          </div>
        </div>

        <div className="mb-3">
          <h5>Body</h5>
          <textarea
            name="text"
            className={this.getInputRequiredClass(this.state.text)}
            onChange={this.handleInputChange}
            placeholder="Insert body"
            value={this.state.text}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.text)}
          >
            Body must be provided
          </div>
        </div>

        <div className="mb-3">
          <h5>Video</h5>
          <input
            type="text"
            className="post_field"
            placeholder="Insert video URL (Optional)"
            ref={this.video}
            defaultValue={""}
          />
        </div>

        <div>
          <h5>Image</h5>
        </div>
        <div className="custom-file">
          <label className="custom-file-label">Insert image (Optional)</label>
          <input
            type="file"
            className="custom-file-input"
            ref={this.image}
            defaultValue={""}
          />
        </div>
      </form>
    );
  }

  public getActionButton() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        data-dismiss="modal"
        onClick={
          this.mode === CREATE_MODE
            ? this.handlePostCreation
            : this.handlePostEdition
        }
        disabled={!this.validPost()}
      >
        {this.mode === CREATE_MODE ? "Create new post" : "Save changes"}
      </button>
    );
  }

  public render() {
    const classnameId = "post_modal_" + this.mode;

    return (
      <div
        id={classnameId}
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
            <div className="modal-body">{this.getPostForm()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={this.handlePostCancel}
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

export default PostModal;

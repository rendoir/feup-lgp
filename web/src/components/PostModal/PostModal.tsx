import React, { Component } from "react";
import classNames from "classnames";

import createSequence from "../../utils/createSequence";

import "./PostModal.module.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";
import { checkPropTypes } from "prop-types";

const CREATE_MODE = 0;
const EDIT_MODE = 1;

interface Props {
  /* The following attributes are only required for post edition */
  id?: number;
  title?: string;

  content_width: number;

  images: Array<string> | undefined;
  videos: Array<string> | undefined;
  text: string | undefined;

  createHandler?: any; //Only required for post creation
  editHandler?: any;

  onChange?: (state: State) => any;
}

interface State {
  title: string;
  text: string;
}

const seq = createSequence();

class PostModal extends Component<Props, State> {
  mode: string;

  image: any = React.createRef();
  video: any = React.createRef();

  constructor(props: Props) {
    super(props);

    this.mode = props.id ? "Edit" : "Create";

    this.state = {
      // Post title and text are stored in state so that we can have a dynamic design on their respective input fields
      title: props.title || "",
      text: props.text || ""
    };

    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event: any) {
    const field = event.target.name;
    const value = event.target.value;
    console.log(field, ": ", value);
    var partialState: any = {};
    partialState[field] = value;
    this.setState(partialState);
  }

  getInputRequiredClass(content: string) {
    return content === "" ? "form-control" : "";
  }

  getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  getPostForm() {
    return (
      <form id="post_modal_form" className="was-validated">
        <div className="mb-3">
          <h5>Title</h5>
          <input
            name="title"
            type="text"
            className={`post_field ${this.getInputRequiredClass(
              this.state.title
            )}`}
            onChange={this.handleInputChange}
            placeholder="Insert title"
            value={this.state.title}
            required
          />
          <div
            className="invalid-feedback"
            style={this.getInputRequiredStyle(this.state.title)}
          >
            Title must be provided
          </div>
        </div>

        <div className="mb-3">
          <h5>Body</h5>
          <textarea
            name="text"
            className={`post_field ${this.getInputRequiredClass(
              this.state.text
            )}`}
            onChange={this.handleInputChange}
            placeholder="Insert body"
            value={this.state.text}
            required
          />
          <div
            className="invalid-feedback"
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

        <div className="custom-file">
          <label className="custom-file-label">Image</label>
          <input
            type="file"
            className="custom-file-input"
            placeholder="Insert image (Optional)"
            ref={this.image}
            defaultValue={""}
          />
        </div>
      </form>
    );
  }
  render() {
    //const className = classNames(styles.container);

    return (
      <div
        id="post_modal"
        className="modal fade w-75"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
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
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={this.props.editHandler}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostModal;

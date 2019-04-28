import axios from "axios";
import React, { Component } from "react";

import "./PostModal.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import { checkPropTypes } from "prop-types";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import Select from "../Select/Select";
import VideoPreloader from "../VideoPreloader/VideoPreloader";
import PostFile from "../PostFile/PostFile";

const CREATE_MODE = "Create";
const EDIT_MODE = "Edit";

type MyFile = {
  name: string;
  mimetype: string;
  src?: string;
  size: number;
};

interface IProps {
  /* The following attributes are only required for post edition */
  id?: number;
  title?: string;
  text?: string;
  visibility?: string;

  files?: MyFile[];
}

interface IState {
  title: string;
  text: string;

  images: File[];
  videos: File[];
  docs: File[];
  visibility: string;

  removedFiles?: MyFile[];
}

class PostModal extends Component<IProps, IState> {
  public mode: string;

  private visibilityOptions = [
    { value: "public", title: "Public" },
    { value: "followers", title: "Followers" },
    { value: "private", title: "Private" }
  ];

  constructor(props: IProps) {
    super(props);

    this.mode = props.id ? EDIT_MODE : CREATE_MODE;

    this.state = {
      // Post title and text are stored in state so that we can have a dynamic design on their respective input fields
      text: props.text || "",
      title: props.title || "",
      images: [],
      videos: [],
      docs: [],
      removedFiles: [],
      visibility: props.visibility || "private"
    };

    // Post manipulation handlers
    this.handlePostCreation = this.handlePostCreation.bind(this);
    this.handlePostEdition = this.handlePostEdition.bind(this);
    this.handlePostCancel = this.handlePostCancel.bind(this);
    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  public handlePostCancel() {
    // Reset field values
    this.setState({
      text: this.props.text || "",
      title: this.props.title || "",
      visibility: this.props.visibility || "private"
    });
  }

  public apiCreatePost() {
    let formData = new FormData();
    this.state.images.forEach((file, i) =>
      formData.append("images[" + i + "]", file)
    );
    this.state.videos.forEach((file, i) =>
      formData.append("videos[" + i + "]", file)
    );
    this.state.docs.forEach((file, i) =>
      formData.append("docs[" + i + "]", file)
    );
    formData.append("author", "1");
    formData.append("text", this.state.text);
    formData.append("title", this.state.title);
    formData.append("visibility", this.state.visibility);

    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/create";
    axios
      .post(postUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log("Post created - reloading page...");
        window.location.href = "/post/" + res.data.id[0].id;
      })
      .catch(() => console.log("Failed to create post"));
  }

  public apiEditPost() {
    let formData = new FormData();
    this.state.images.forEach((file, i) =>
      formData.append("images[" + i + "]", file)
    );
    this.state.videos.forEach((file, i) =>
      formData.append("videos[" + i + "]", file)
    );
    this.state.docs.forEach((file, i) =>
      formData.append("docs[" + i + "]", file)
    );
    if (this.state.removedFiles)
      formData.append("removed", JSON.stringify(this.state.removedFiles));
    formData.append("id", String(this.props.id));
    formData.append("text", this.state.text);
    formData.append("title", this.state.title);
    formData.append("visibility", this.state.visibility);

    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += "/post/edit";
    axios
      .post(postUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log("Post edited - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to edit post"));
  }

  public validPost() {
    return Boolean(
      this.state.title && this.state.text && this.state.visibility
    );
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

  public handleFileUpload(files: FileList | null) {
    if (!files) return;

    let images: File[] = [];
    let videos: File[] = [];
    let docs: File[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith("image")) images.push(file);
      else if (file.type.startsWith("video")) videos.push(file);
      else docs.push(file);
    });

    this.setState({
      images: images,
      videos: videos,
      docs: docs
    });
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
            autoComplete="off"
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
          <h5>Visibility</h5>
          <Select
            name="visibility_select"
            id="visibility_select"
            onChange={visibility => this.setState({ visibility })}
            value={this.state.visibility}
            placeholder="Visibility"
            options={this.visibilityOptions}
          />
        </div>

        <div>
          <h5>Files</h5>
        </div>
        {this.getRemovedFiles()}
        <div className="custom-file">
          <label className="custom-file-label">{this.getFileLabel()}</label>
          <input
            type="file"
            accept="*"
            className="custom-file-input"
            onChange={e => this.handleFileUpload(e.target.files)}
            defaultValue={""}
            multiple={true}
          />
        </div>
      </form>
    );
  }

  public getRemovedFiles() {
    if (this.mode === EDIT_MODE && this.props.files) {
      const toRemove = this.props.files.map(file =>
        this.state.removedFiles && !this.state.removedFiles.includes(file) ? (
          <PostFile
            key={file.name}
            id={this.props.id ? this.props.id : 0}
            file={file}
            editMode={this.mode === EDIT_MODE}
            handleRemove={this.handleRemove}
          />
        ) : null
      );
      return toRemove;
    }
  }

  public handleRemove(fileToRemove: MyFile) {
    if (this.state.removedFiles) {
      let removed = this.state.removedFiles;
      removed.push(fileToRemove);
      this.setState({
        removedFiles: removed
      });
    }
  }

  public getFileLabel() {
    let label = "";

    this.state.images.forEach(file => (label += file.name + " "));
    this.state.videos.forEach(file => (label += file.name + " "));
    this.state.docs.forEach(file => (label += file.name + " "));

    if (label === "") label = "Insert images, videos and documents";

    return label;
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
    const htmlId =
      this.mode === CREATE_MODE
        ? `post_modal_${CREATE_MODE}`
        : `post_modal_${EDIT_MODE}_${this.props.id}`;

    return (
      <div
        id={htmlId}
        className={`modal fade post_modal_${this.mode}`}
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

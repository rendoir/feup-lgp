import React, { Component } from "react";

import "./PostModal.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import { checkPropTypes } from "prop-types";
import AddTags from "../AddTags/AddTags";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import PostFile from "../PostFile/PostFile";
import Select from "../Select/Select";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

import axiosInstance from "../../utils/axiosInstance";
import { dictionary, LanguageContext } from "../../utils/language";

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
  content?: string;
  id: number;
  title?: string;
  visibility?: string;

  files?: MyFile[];
  tags: any[];
}

interface IState {
  title: string;
  content: string;

  images: File[];
  videos: File[];
  docs: File[];

  tags: any[];
  visibility: string;

  removedFiles?: MyFile[];
}

class PostModal extends Component<IProps, IState> {
  public static contextType = LanguageContext;

  public mode: string;
  public addTags: any;

  private visibilityOptions: any;

  constructor(props: IProps) {
    super(props);

    this.mode = props.id ? EDIT_MODE : CREATE_MODE;

    this.state = {
      // Post title and text are stored in state so that we can have a dynamic design on their respective input fields
      content: props.content || "",
      docs: [],
      images: [],
      removedFiles: [],
      tags: [],
      title: props.title || "",
      videos: [],
      visibility: props.visibility || "private"
    };

    this.addTags = React.createRef();

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
      content: this.props.content || "",
      title: this.props.title || "",
      visibility: this.props.visibility || "private"
    });
  }

  public apiCreatePost() {
    const formData = new FormData();
    this.state.images.forEach((file, i) =>
      formData.append("images[" + i + "]", file)
    );
    this.state.videos.forEach((file, i) =>
      formData.append("videos[" + i + "]", file)
    );
    this.state.docs.forEach((file, i) =>
      formData.append("docs[" + i + "]", file)
    );

    this.state.tags.forEach((tag, i) =>
      formData.append("tags[" + i + "]", tag)
    );

    formData.append("text", this.state.content);
    formData.append("title", this.state.title);
    formData.append("visibility", this.state.visibility);

    axiosInstance
      .post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log("Post created - reloading page...");
        window.location.href = "/post/" + res.data.id;
      })
      .catch(() => console.log("Failed to create post"));
  }

  public apiEditPost() {
    const formData = new FormData();

    this.state.tags.forEach((tag, i) =>
      formData.append("tags[" + i + "]", tag)
    );

    this.state.images.forEach((file, i) =>
      formData.append("images[" + i + "]", file)
    );
    this.state.videos.forEach((file, i) =>
      formData.append("videos[" + i + "]", file)
    );
    this.state.docs.forEach((file, i) =>
      formData.append("docs[" + i + "]", file)
    );
    if (this.state.removedFiles) {
      formData.append("removed", JSON.stringify(this.state.removedFiles));
    }
    formData.append("author", "1");
    formData.append("text", this.state.content);
    formData.append("title", this.state.title);
    formData.append("visibility", this.state.visibility);

    axiosInstance
      .put(`/post/${this.props.id}`, formData, {
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
      this.state.title && this.state.content && this.state.visibility
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
    if (!files) {
      return;
    }

    const images: File[] = [];
    const videos: File[] = [];
    const docs: File[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith("image")) {
        images.push(file);
      } else if (file.type.startsWith("video")) {
        videos.push(file);
      } else {
        docs.push(file);
      }
    });

    this.setState({
      docs,
      images,
      videos
    });
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  public getPostForm() {
    this.visibilityOptions = [
      { value: "public", title: dictionary.visibility_public[this.context] },
      {
        title: dictionary.visibility_followers[this.context],
        value: "followers"
      },
      { value: "private", title: dictionary.visibility_private[this.context] }
    ];

    return (
      <form className="was-validated">
        <div className="mb-3">
          <h5>{dictionary.title[this.context]}</h5>
          <input
            name="title"
            type="text"
            autoComplete="off"
            className={this.getInputRequiredClass(this.state.title)}
            onChange={this.handleInputChange}
            placeholder={dictionary.insert_title[this.context]}
            value={this.state.title}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.title)}
          >
            {dictionary.title_required[this.context]}
          </div>
        </div>

        <div className="mb-3">
          <h5>{dictionary.body[this.context]}</h5>
          <textarea
            name="content"
            className={this.getInputRequiredClass(this.state.content)}
            onChange={this.handleInputChange}
            placeholder={dictionary.insert_body[this.context]}
            value={this.state.content}
            required={true}
          />
          <div
            className="field_required_warning"
            style={this.getInputRequiredStyle(this.state.content)}
          >
            {dictionary.body_required[this.context]}
          </div>
        </div>

        <div className="mb-3">
          <h5>{dictionary.visibility[this.context]}</h5>
          <Select
            name="visibility_select"
            id="visibility_select"
            onChange={visibility => this.setState({ visibility })}
            value={this.state.visibility}
            placeholder={dictionary.visibility[this.context]}
            options={this.visibilityOptions}
          />
        </div>

        <div className="mb-3">
          <h5>{dictionary.tags[this.context]}</h5>
          <AddTags onChange={this.handleTagsChange} tags={this.props.tags} />
        </div>

        <div>
          <h5>{dictionary.files[this.context]}</h5>
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
      const removed = this.state.removedFiles;
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

    if (label === "") {
      label = dictionary.insert_files[this.context];
    }

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
        {this.mode === CREATE_MODE
          ? dictionary.create_new_post[this.context]
          : dictionary.save_changes[this.context]}
      </button>
    );
  }

  public handleTagsChange = (tags: any, newtags: any) => {
    this.setState({ tags: newtags });
  };

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
                {`${dictionary[this.mode][this.context]} ${
                  dictionary.post_cap[this.context]
                }`}
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
                {dictionary.cancel[this.context]}
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

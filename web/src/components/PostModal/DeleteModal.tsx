import axios from "axios";
import React, { Component } from "react";

import "./PostModal.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import { checkPropTypes } from "prop-types";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

import { getApiURL } from "../../utils/apiURL";
import { dictionary, LanguageContext } from "../../utils/language";

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

class DeleteModal extends Component<IProps, IState> {
  static contextType = LanguageContext;

  public mode: string;

  public image: any = React.createRef();
  public video: any = React.createRef();

  constructor(props: IProps) {
    super(props);

    this.mode = props.id ? DELETE_MODE : CREATE_MODE;

    this.state = {
      // Post title and text are stored in state so that we can have a dynamic design on their respective input fields
      redirect: false,
      text: props.text || "",
      title: props.title || ""
    };

    // Post manipulation handlers
    this.handlePostDeletion = this.handlePostDeletion.bind(this);
    // Field change handlers
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public apiDeletePost() {
    const postUrl = getApiURL(`/post/${this.props.id}`);
    axios
      .delete(postUrl, {
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        console.log("Post deleted - reloading page");
        if (window.location.pathname === "/post/" + this.props.id) {
          this.setState({
            redirect: true
          });
          this.handleRedirect();
        } else {
          window.location.reload();
        }
      })
      .catch(() => console.log("Failed to delete post"));
  }

  public handlePostDeletion() {
    this.apiDeletePost();
  }

  public renderRedirect() {
    if (this.state.redirect) {
      window.location.href = "/";
    }
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

  public handleRedirect() {
    if (window.location.pathname === "/post/" + this.props.id) {
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
          onClick={this.handlePostDeletion}
        >
          {dictionary.yes[this.context]}
        </button>
      </div>
    );
  }

  public render() {
    return (
      <div
        id={`delete_post_modal_${this.props.id}`}
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
                {`${dictionary[this.mode][this.context]} ${
                  dictionary.post[this.context]
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
            <div className="modal-body">
              <p>{dictionary.confirm_delete_post[this.context]}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
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

export default DeleteModal;

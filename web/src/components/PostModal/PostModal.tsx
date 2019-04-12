import React, { Component } from "react";
import classNames from "classnames";

import createSequence from "../../utils/createSequence";

import styles from "./PostModal.module.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

const CREATE_MODE = 0;
const EDIT_MODE = 1;

interface Props {
  id?: number;

  content_width: number;

  hasImage: boolean;
  image: string | undefined;
  image_height: number;

  hasVideo: boolean;
  video: string | undefined;
  video_height: number;

  text: string | undefined;
  text_height: number;

  editHandler?: any;
  createHandler?: any;
  onChange?: (state: State) => any;
}

/* we dont need it yet */
interface State {}

const seq = createSequence();

class PostModal extends Component<Props, State> {
  static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const className = classNames(styles.container);

    return (
      <div
        className="modal fade"
        id="edit_post_modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Modal title
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
              <p>this is a test</p>
            </div>
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

import classNames from "classnames";
import React, { Component } from "react";

import createSequence from "../../utils/createSequence";

// import styles from "./PostModal.module.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

const CREATE_MODE = 0;
const EDIT_MODE = 0;

interface Props {
  id?: number;

  content_width: number;

  images: string[] | undefined;
  videos: string[] | undefined;
  text: string | undefined;

  editHandler?: any;
  createHandler?: any;
  deleteHandler?: any;
  onChange?: (state: State) => any;
}

/* we dont need it yet */
interface State {}

const seq = createSequence();

class DeleteModal extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public render() {
    // const className = classNames(styles.container);

    return (
      <div
        className="modal fade"
        id="delete_post_modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Delete post
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
                Yes
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={this.props.editHandler}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteModal;

import React, { Component } from "react";
import classNames from "classnames";

import createSequence from "../../utils/createSequence";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "@fortawesome/fontawesome-free/css/all.css";

import styles from "./PostModal.module.css";

import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";

import ImagePreloader from "../ImagePreloader/ImagePreloader";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

export type Props = {
  content_width: number;
  content_height: number;

  hasImage: boolean;
  image: string | undefined;
  image_height: number;

  hasVideo: boolean;
  video: string | undefined;
  video_height: number;

  text: string | undefined;
  text_height: number;

  comments: undefined;

  onChange?: (state: State) => any;
};

export type State = {
  isOpen: boolean;
};

const seq = createSequence();

class PostModal extends Component<Props, State> {
  id: string;

  static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.id = "post_creator_" + seq.next();
    this.state = { isOpen: false };
  }

  render() {
    const className = classNames(styles.container);
    const isOpen = this.state.isOpen;

    let postDiv;

    if (isOpen) {
      postDiv = (
        <div id="newPostModal" className="modal" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal title</h5>
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
                <p>Modal body text goes here.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return { postDiv };
  }
}

export default PostModal;

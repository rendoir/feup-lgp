// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "../Post/Post.module.css";

// - Import app components
import Post from "../Post/Post";

type MyFile = {
  name: string;
  mimetype: string;
  src?: string;
  size: number;
};

export type Props = {
  file: MyFile;
};

export type State = {};

class PostFile extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div className={styles.post_content_files}>
        <div className="w-100 d-flex align-items-center">
          <i className="far fa-file fa-2x ml-2 pointer" />

          <div className="ml-3">
            <div>
              <b className="pointer">{this.props.file.name}</b>
            </div>
            <div className="d-inline-block">
              <span>{this.props.file.mimetype}</span>
              <span className="ml-3">{this.props.file.size} Bytes</span>
            </div>
          </div>

          <div className="ml-auto mr-2">
            <button className="h-100 w-100 py-1">
              <i className="fas fa-download" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PostFile;

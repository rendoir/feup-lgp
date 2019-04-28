// - Import react components
import React, { Component } from "react";
import axios from "axios";

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
  id: number;
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
          <i
            className="far fa-file fa-2x ml-2 pointer"
            onClick={this.handleDownload.bind(this)}
          />

          <div className="ml-3">
            <div>
              <b className="pointer" onClick={this.handleDownload.bind(this)}>
                {this.props.file.name}
              </b>
            </div>
            <div className="d-inline-block">
              <span>{this.props.file.mimetype}</span>
              <span className="ml-3">{this.props.file.size} Bytes</span>
            </div>
          </div>

          <div className="ml-auto mr-2">
            <button
              className="h-100 w-100 py-1"
              onClick={this.handleDownload.bind(this)}
            >
              <i className="fas fa-download" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  public handleDownload() {
    let downloadURL = `${location.protocol}//${location.hostname}`;
    downloadURL +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    downloadURL +=
      "/post/download/" + this.props.id + "/" + this.props.file.name;

    axios
      .get(downloadURL, {
        responseType: "blob"
      })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.props.file.name);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => console.log("Failed to download file"));
  }
}

export default PostFile;

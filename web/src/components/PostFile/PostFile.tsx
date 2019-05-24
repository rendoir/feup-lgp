// - Import react components
import React, { Component } from 'react';
// - Import app components
import axiosInstance from '../../utils/axiosInstance';
// - Import styles
import styles from '../Post/Post.module.css';

type MyFile = {
  name: string;
  mimetype: string;
  src?: string;
  size: number;
};

export type Props = {
  id: number;
  file: MyFile;

  editMode?: boolean;
  handleRemove?: (file: MyFile) => any;
};

export type State = {};

class PostFile extends Component<Props, State> {
  public static defaultProps = {};

  constructor(props: Props) {
    super(props);

    this.handleDownload = this.handleDownload.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  public render() {
    return (
      <div className={styles.post_content_files}>
        <div className="w-100 d-flex align-items-center">
          <i
            className="far fa-file fa-2x ml-2 pointer"
            onClick={this.handleDownload}
          />

          <div className="ml-3">
            <div>
              <b className="pointer" onClick={this.handleDownload}>
                {this.props.file.name}
              </b>
            </div>
            <div className="d-inline-block">
              <span>{this.props.file.mimetype}</span>
              <span className="ml-3">{this.getSize(this.props.file.size)}</span>
            </div>
          </div>

          <div className="ml-auto mr-2">{this.getButton()}</div>
        </div>
      </div>
    );
  }

  public getSize(size: number) {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1048576) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / 1048576).toFixed(2) + ' MB';
    }
  }

  public getButton() {
    if (!this.props.editMode) {
      return (
        <button className="h-100 w-100 py-1" onClick={this.handleDownload}>
          <i className="fas fa-download" />
        </button>
      );
    } else {
      return (
        <button className="h-100 w-100 py-1" onClick={this.handleRemove}>
          <i className="fas fa-trash" />
        </button>
      );
    }
  }

  public handleRemove(e: any) {
    e.preventDefault();
    if (this.props.handleRemove) {
      this.props.handleRemove(this.props.file);
    }
  }

  public handleDownload() {
    const downloadURL = `/post/download/${this.props.id}/${
      this.props.file.name
    }`;

    axiosInstance
      .get(downloadURL, {
        responseType: 'blob'
      })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this.props.file.name);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => console.log('Failed to download file'));
  }
}

export default PostFile;

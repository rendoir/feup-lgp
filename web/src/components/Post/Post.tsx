// - Import react components
import React, { Component } from "react";

// - Import styles
import styles from "./Post.module.css";

// - Import app components
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import DeleteModal from "../PostModal/DeleteModal";
import PostModal from "../PostModal/PostModal";
import VideoPreloader from "../VideoPreloader/VideoPreloader";
import PostCarousel from "../PostCarousel/PostCarousel";
import PostFile from "../PostFile/PostFile";

type MyFile = {
  name: string;
  mimetype: string;
  src?: string;
  size: number;
};

type Props = {
  id: number;

  title: string;

  date: string | undefined;

  author: string;

  text: string | undefined;

  comments: any[];

  files?: MyFile[];
};

type State = {
  isHovered: boolean;
  clickedImage: string | undefined;
  data: any;

  images: MyFile[];
  videos: MyFile[];
  docs: MyFile[];
};

class Post extends Component<Props, State> {
  public static defaultProps = {};
  public id: string;

  constructor(props: Props) {
    super(props);

    this.id = "post_" + this.props.id;
    this.state = {
      data: "",
      isHovered: false,
      clickedImage: undefined,

      images: [],
      videos: [],
      docs: []
    };

    this.initFiles();

    this.handleDeletePost = this.handleDeletePost.bind(this);
  }

  public render() {
    return (
      <div>
        <div>{this.renderOverlay()}</div>
        <div className={`${styles.post} mb-4`}>
          <div className={styles.post_header}>
            <Avatar
              title={this.props.author}
              placeholder="empty"
              size={30}
              image="https://picsum.photos/200/200?image=52"
            />
            <a
              className={styles.post_author}
              href={"/user/" + this.props.author}
            >
              {" "}
              {this.props.author}
            </a>
            <a className={styles.post_date} href={"/post/" + this.props.id}>
              {this.props.date}
            </a>
            <div className={`${styles.post_options} btn-group`}>
              <button
                className="w-100 h-100 ml-2"
                role="button"
                data-toggle="dropdown"
              >
                <i className="fas fa-ellipsis-v" />
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <button
                  className="dropdown-item"
                  type="button"
                  data-toggle="modal"
                  data-target="#post_modal_Edit"
                >
                  Edit Post
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  data-toggle="modal"
                  data-target="#delete_post_modal"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
          <div className={styles.post_content_text}>
            <h4> {this.props.title} </h4>
          </div>
          <div className={styles.post_content_text}>
            <p> {this.props.text} </p>
          </div>
          {this.getImages()}
          {this.getVideos()}
          {this.getFiles()}
          <div className={styles.post_stats}>
            <span>35 likes</span>
            <span>14 comments</span>
          </div>
          <div className={styles.post_actions}>
            <button>
              <i className="fas fa-thumbs-up" />
              <span>Like</span>
            </button>
            <button>
              <i className="far fa-comment-alt" />
              <span>Comment</span>
            </button>
            <button>
              <i className="fas fa-share-square" />
              <span>Share</span>
            </button>
          </div>
          {/* Post edition modal */}
          <PostModal {...this.props} />
          {/* Delete Post */}
          <DeleteModal {...this.props} />
          {/* Comment section*/}
          <div className={styles.post_comment_section}>
            {this.getCommentSection()}
            <div className={styles.post_add_comment}>
              <Avatar
                title={this.props.author}
                placeholder="empty"
                size={30}
                image="https://picsum.photos/200/200?image=52"
              />
              <textarea
                className="form-control ml-4 mr-3"
                placeholder="Insert your comment..."
              />
              <button className={`${styles.submit_comment} px-2 py-1`}>
                <i className="fas fa-chevron-circle-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public handleDeletePost() {
    console.log("DELETE POST");
  }

  public getCommentSection() {
    const commentSection = this.props.comments.map((comment, idx) => {
      return (
        <Comment
          key={idx}
          title={comment.id}
          author={comment.first_name + " " + comment.last_name}
          text={comment.comment}
        />
      );
    });

    return <div className={styles.post_comments}>{commentSection}</div>;
  }

  private handleImageClick(src: String | undefined) {
    if (src) {
      this.setState({
        clickedImage: src
      } as State);
    }
  }

  private handleOverlayClick() {
    this.setState({
      clickedImage: undefined
    } as State);
  }

  private renderOverlay() {
    if (this.state.clickedImage != undefined) {
      return (
        <div
          className={styles.overlay}
          onClick={this.handleOverlayClick.bind(this)}
        >
          <ImagePreloader src={this.state.clickedImage}>
            {({ src }) => {
              return <img src={src} />;
            }}
          </ImagePreloader>
        </div>
      );
    }
  }

  private getImages() {
    if (this.state.images.length) {
      if (this.state.images.length >= 2) {
        return (
          <PostCarousel
            key={this.props.id}
            id={this.props.id}
            images={this.state.images}
            parent={this}
            handleImageClick={this.handleImageClick}
          />
        );
      } else if (this.state.images.length == 1) {
        let image = this.state.images[0];
        return (
          <div
            className={styles.post_content_media}
            onClick={this.handleImageClick.bind(this, image.src)}
          >
            <ImagePreloader src={image.src}>
              {({ src }) => {
                return <img src={src} />;
              }}
            </ImagePreloader>
          </div>
        );
      }
    }
  }

  private getVideos() {
    const videoDiv = [];

    if (this.state.videos.length) {
      for (const video of this.state.videos) {
        videoDiv.push(
          <div className={styles.post_content_media}>
            <iframe
              src={video.src}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={true}
            />
          </div>
        );
      }
    }

    return videoDiv;
  }

  private getFiles() {
    const filesDiv = [];

    if (this.state.docs.length) {
      for (const file of this.state.docs) {
        filesDiv.push(<PostFile key={file.name} file={file} />);
      }
    }

    return filesDiv;
  }

  private initFiles() {
    if (this.props.files) {
      let src = `${location.protocol}//${location.hostname}`;
      src +=
        !process.env.NODE_ENV || process.env.NODE_ENV === "development"
          ? `:${process.env.REACT_APP_API_PORT}`
          : "/api";
      src += "/post/" + this.props.id + "/";

      Array.from(this.props.files).forEach(file => {
        file.src = src + file.name;
        if (file.mimetype.startsWith("image")) this.state.images.push(file);
        else if (file.mimetype.startsWith("video"))
          this.state.videos.push(file);
        else this.state.docs.push(file);
      });
    }
  }
}

export default Post;

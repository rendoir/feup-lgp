// - Import react components
import axios from "axios";
import classNames from "classnames";
import React, { Component } from "react";
import Cookies from "universal-cookie";

// - Import styles
import styles from "./Post.module.css";

// - Import app components
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import DeleteModal from "../PostModal/DeleteModal";
import PostModal from "../PostModal/PostModal";
// import { IconProp } from "@fortawesome/fontawesome-svg-core";
// import VideoPreloader from "../VideoPreloader/VideoPreloader";

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import Icon from "../Icon/Icon";

// - Import utils
import { apiSubscription } from "../../utils/apiSubscription";
import { apiGetUserInteractions } from "../../utils/apiUserInteractions";

type IProps = {
  id: number;
  title: string;
  date: string | undefined;
  images: string[] | undefined;
  videos: string[] | undefined;
  author: string;
  text: string | undefined;
  likes: number;
  visibility: string;
  comments: any[];
  likers: any[];
};

interface IState {
  commentValue: string;
  isHovered: boolean;
  isFetching: boolean;
  postID: number;
  activePage: number;
  fetchingPostUserInteractions: boolean;
  userRate: number;
  userSubscription: boolean;
  waitingRateRequest: boolean;
  waitingSubscriptionRequest: boolean;
}

const cookies = new Cookies();

class Post extends Component<IProps, IState> {
  public static defaultProps = {};
  public id: string;
  public userId: number;

  constructor(props: IProps) {
    super(props);

    this.id = "post_" + this.props.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly
    console.log("Cookie user ID: ", cookies.get("user_id"));

    this.state = {
      activePage: 1,
      commentValue: "",
      fetchingPostUserInteractions: true,
      isFetching: true,
      isHovered: false,
      userRate: 0,
      userSubscription: false,
      waitingRateRequest: false,
      waitingSubscriptionRequest: false,
      postID: 0
    };
    console.log("rate: ", this.state.userRate);
    console.log("subscription: ", this.state.userSubscription);

    this.handleAddComment = this.handleAddComment.bind(this);
    this.changeCommentValue = this.changeCommentValue.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.handleAddLike = this.handleAddLike.bind(this);
    this.handlePostRate = this.handlePostRate.bind(this);
    this.handlePostSubscription = this.handlePostSubscription.bind(this);
  }

  public render() {
    const { isFetching } = this.state;

    if (this.state.fetchingPostUserInteractions) {
      return null;
    }

    console.log(this.state);

    return (
      <div>
        {isFetching ? (
          <div>Loading...</div>
        ) : (
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
              <Icon
                icon={this.getVisibilityIcon(this.props.visibility)}
                size="lg"
              />
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
                    data-target={`#post_modal_Edit_${this.props.id}`}
                  >
                    Edit Post
                  </button>
                  <button
                    className="dropdown-item"
                    type="button"
                    data-toggle="modal"
                    data-target={`#delete_post_modal_${this.props.id}`}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.post_content}>
              <h4> {this.props.title} </h4>
            </div>
            <div className={styles.post_content}>
              <p> {this.props.text} </p>
            </div>
            {this.getImages()}
            {this.getVideos()}
            <div className={styles.post_stats}>
              <span
                key={this.id + "_span_like_button"}
                role="button"
                data-toggle="dropdown"
                data-target={"#post_" + this.props.id + " show_likes"}
              >
                {this.props.likes} likes
                {this.getLikes()}
              </span>
              <span> {this.props.comments.length} comments</span>
            </div>
            {this.getUserInteractionButtons()}
            {/* Post edition modal */}
            <PostModal {...this.props} />
            {/* Delete Post */}
            <DeleteModal {...this.props} />
            {/* Comment section*/}
            <div className={`${styles.post_comment_section} w-100`}>
              {this.getCommentSection()}
              <ul className="pagination">{this.getPagination()}</ul>
              <form
                className={styles.post_add_comment}
                onSubmit={this.handleAddComment}
              >
                <Avatar
                  title={this.props.author}
                  placeholder="empty"
                  size={30}
                  image="https://picsum.photos/200/200?image=52"
                />
                <textarea
                  className={`form-control ml-4 mr-3 ${this.getInputRequiredClass(
                    this.state.commentValue
                  )}`}
                  placeholder="Insert your comment..."
                  value={this.state.commentValue}
                  onChange={this.changeCommentValue}
                  onKeyDown={this.onEnterPress}
                  required={true}
                />
                <button
                  className={`${styles.submit_comment} px-2 py-1`}
                  type="submit"
                  value="Submit"
                  disabled={!this.validComment()}
                >
                  <i className="fas fa-chevron-circle-right" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  private getUserInteractionButtons() {
    const subscribeIcon = this.state.userSubscription
      ? "fas fa-bell-slash"
      : "fas fa-bell";
    const subscribeBtnText = this.state.userSubscription
      ? "Unsubscribe"
      : "Subscribe";

    return (
      <div className={styles.post_actions}>
        <button onClick={this.handleAddLike}>{this.userLiked()}</button>
        <button onClick={this.handlePostSubscription}>
          <i className={subscribeIcon} />
          <span>{subscribeBtnText}</span>
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
    );
  }

  public componentDidMount() {
    this.apiGetPostUserInteractions();
    let currentPage;
    if (this.props.comments === [] || this.props.comments === undefined) {
      currentPage = 1;
    } else {
      currentPage = Math.ceil(this.props.comments.length / 5);
    }
    this.setState({
      activePage: currentPage,
      isFetching: false,
      postID: this.props.id
    });
  }

  public onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.apiComments();
    }
  };

  public apiComments() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += `/post/${this.state.postID}/comment/new`;

    axios
      .post(postUrl, {
        author: 1, // When loggin, this is the user logged in
        comment: this.state.commentValue,
        headers: {},
        post_id: this.state.postID
      })
      .then(res => {
        console.log("Comment created - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to create comment"));
  }

  public userLiked() {
    const userLoggedIn = 2;
    const divStyle = { color: "black" };

    const foundValue = this.props.likers.find(e => {
      if (e.id === userLoggedIn.toString()) {
        return e;
      } else {
        return null;
      }
    });

    if (foundValue != null) {
      divStyle.color = "black";
      return (
        <div>
          <i className="fas fa-thumbs-up" style={divStyle} />
          <span>Like</span>
        </div>
      );
    } else {
      divStyle.color = "blue";
      return (
        <div>
          <i className="fas fa-thumbs-up" style={divStyle} />
          <span>Dislike</span>
        </div>
      );
    }
  }

  public validComment() {
    return Boolean(this.state.commentValue);
  }

  public getInputRequiredClass(content: string) {
    return content === "" ? "empty_required_field" : "post_field";
  }

  public getInputRequiredStyle(content: string) {
    return content !== "" ? { display: "none" } : {};
  }

  public changeCommentValue(event: any) {
    this.setState({ commentValue: event.target.value });
  }

  public handleAddComment(event: any) {
    event.preventDefault();
    this.apiComments();
  }

  public handlePageChange(event: any) {
    const target = event.target || event.srcElement;
    this.setState({ activePage: Number(target.innerHTML) });
  }

  public handleAddLike(event: any) {
    event.preventDefault();

    const userLoggedIn = 2;
    const foundValue = this.props.likers.find(e => {
      if (e.id === userLoggedIn.toString()) {
        return e;
      } else {
        return null;
      }
    });

    if (foundValue != null) {
      this.apiDeleteLikeToPost();
    } else {
      this.apiAddLikeToPost();
    }
  }

  public apiAddLikeToPost() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += `/post/${this.props.id}/like`;

    axios
      .post(postUrl, {
        author: 2,
        headers: {}
      })
      .then(res => {
        window.location.reload();
      })
      .catch(() => console.log("Failed to add like to comment"));
  }

  public apiDeleteLikeToPost() {
    let postUrl = `${location.protocol}//${location.hostname}`;
    postUrl +=
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? `:${process.env.REACT_APP_API_PORT}`
        : "/api";
    postUrl += `/post/${this.props.id}/like`;

    axios
      .delete(postUrl, {
        data: {
          author: 2
        },
        headers: {
          /*'Authorization': "Bearer " + getToken()*/
        }
      })
      .then(res => {
        console.log("Post disliked - reloading page...");
        window.location.reload();
      })
      .catch(() => console.log("Failed to delete like from a post"));
  }

  public handlePostRate() {
    console.log("RATE LOGGED USER ID: ", this.userId);
  }

  public handlePostSubscription() {
    console.log("SUBSCRIBE LOGGED USER ID: ", this.userId);

    if (this.state.waitingSubscriptionRequest) {
      console.log(
        "Error trying subscription action! Waiting for response from last request"
      );
      return;
    }

    const endpoint = this.state.userSubscription ? "unsubscribe" : "subscribe";
    const subscriptionState = !this.state.userSubscription;

    this.setState({
      userSubscription: subscriptionState,
      waitingSubscriptionRequest: true
    });
    console.log(this.state);
    this.apiSubscription(endpoint);
  }

  public apiSubscription(endpoint: string) {
    apiSubscription("post", endpoint, this.userId, this.props.id)
      .then(() => {
        this.setState({
          waitingSubscriptionRequest: false
        });
        console.log("SUBSCRIÇAO BEM SUCEDIDA", this.state);
      })
      .catch(() => {
        this.setState({
          userSubscription: endpoint === "unsubscribe",
          waitingSubscriptionRequest: false
        });
        console.log("Subscription system failed");
      });
  }

  public apiGetPostUserInteractions() {
    apiGetUserInteractions("post", this.userId, this.props.id)
      .then(res => {
        console.log(res.data);
        this.setState({
          fetchingPostUserInteractions: false,
          userRate: res.data.rate || 0,
          userSubscription: res.data.subscription
        });
      })
      .catch(() => console.log("Failed to get post-user interactions"));
  }

  public getCommentSection() {
    if (this.props.comments === [] || this.props.comments === undefined) {
      return <div className={`${styles.post_comment} w-100`} />;
    }

    let currentComments = [];
    if (this.props.comments.length < 6) {
      currentComments = this.props.comments;
    } else {
      const indexOfLast = this.state.activePage * 5;
      const indexOfFirst = indexOfLast - 5;

      currentComments = this.props.comments.slice(indexOfFirst, indexOfLast);
    }

    const commentSection = currentComments.map((comment, idx) => {
      return (
        <Comment
          key={idx}
          postID={comment.post}
          title={comment.id}
          author={comment.first_name + " " + comment.last_name}
          text={comment.comment}
          secondLevel={false}
        />
      );
    });

    return (
      <div className={`${styles.post_comment} w-100`}>{commentSection}</div>
    );
  }

  public getLikers() {
    const likedUsersDiv = this.props.likers.map((liker, idx) => {
      return (
        <span key={"user" + idx + "liked-post"} className="dropdown-item">
          {liker.first_name} {liker.last_name}
        </span>
      );
    });

    return likedUsersDiv;
  }

  public getLikes() {
    const likesDiv = [];
    if (this.props.likes > 0) {
      likesDiv.push(this.getLikers());
    }

    return (
      <span
        id={"post_" + this.props.id + "_span_show_likes"}
        className="dropdown-menu dropdown-menu-right"
      >
        {likesDiv}
      </span>
    );
  }

  private getPagination() {
    if (
      this.props.comments === [] ||
      this.props.comments === undefined ||
      this.props.comments.length < 6
    ) {
      return;
    }

    const pageNumbersInd = [];
    for (let i = 1; i <= Math.ceil(this.props.comments.length / 5); i++) {
      pageNumbersInd.push(i);
    }

    const renderPageNumbers = pageNumbersInd.map(pageNumber => {
      return (
        <li
          key={pageNumber}
          className="page-item"
          onClick={this.handlePageChange}
        >
          <a className="page-link">{pageNumber}</a>
        </li>
      );
    });

    return renderPageNumbers;
  }

  private getVisibilityIcon(v: string): IconDefinition {
    switch (v) {
      case "public":
        return faGlobeAfrica;
      case "followers":
        return faUserFriends;
      case "private":
        return faLock;
      default:
        return faQuestion;
    }
  }

  private getImages() {
    const imgDiv = [];

    if (this.props.images) {
      // if exists
      for (const image of this.props.images) {
        imgDiv.push(
          <div className={styles.post_content}>
            <ImagePreloader src={image}>
              {({ src }) => {
                return <img src={src} width="100" />;
              }}
            </ImagePreloader>
          </div>
        );
      }
    }

    return imgDiv;
  }

  private getVideos() {
    const videoDiv = [];

    if (this.props.videos) {
      // if exists
      for (const video of this.props.videos) {
        videoDiv.push(
          <div className={styles.post_content}>
            <iframe
              width="100"
              src={video}
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
}

export default Post;

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
import PostFile from "../PostFile/PostFile";
import PostImageCarousel from "../PostImageCarousel/PostImageCarousel";
import DeleteModal from "../PostModal/DeleteModal";
import PostModal from "../PostModal/PostModal";
import ReportModal from "../PostModal/ReportModal";
import VideoPreloader from "../VideoPreloader/VideoPreloader";

type MyFile = {
  name: string;
  mimetype: string;
  src?: string;
  size: number;
};

// - Import utils
import { apiCheckPostUserReport } from "../../utils/apiReport";
import { apiSubscription } from "../../utils/apiSubscription";
import { apiGetUserInteractions } from "../../utils/apiUserInteractions";

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { getApiURL } from "../../utils/apiURL";
import Icon from "../Icon/Icon";
import PostVideoCarousel from "../PostVideoCarousel/PostVideoCarousel";

interface IProps {
  id: number;
  title: string;
  date: string | undefined;
  author: string;
  text: string | undefined;
  likes: number;
  visibility: string;
  comments: any[];

  files?: MyFile[];
  likers: any[];
  tags: any[];
}

interface IState {
  activePage: number;
  commentValue: string;
  clickedImage: string | undefined;
  data: any;

  images: MyFile[];
  videos: MyFile[];
  docs: MyFile[];

  fetchingPostUserInteractions: boolean;
  isFetching: boolean;
  isHovered: boolean;
  numberOfRatings: number;
  postID: number;
  postRated: boolean;
  tags: any[];
  userRate: number;
  userReport: boolean; // Tells if the logged user has reported this post
  userRateTotal: number;
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

    this.state = {
      activePage: 1,
      clickedImage: undefined,
      commentValue: "",
      data: "",
      docs: [],
      fetchingPostUserInteractions: true,
      images: [],
      isFetching: true,
      isHovered: false,
      numberOfRatings: 1,
      postID: 0,
      postRated: false,
      tags: [],
      userRate: 50,
      userRateTotal: 50,
      userReport: false,
      userSubscription: false,
      videos: [],
      waitingRateRequest: false,
      waitingSubscriptionRequest: false
    };

    this.initFiles();

    this.handlePostReport = this.handlePostReport.bind(this);
    this.handleReportCancel = this.handleReportCancel.bind(this);
    this.handlePostRate = this.handlePostRate.bind(this);
    this.handlePostSubscription = this.handlePostSubscription.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.changeCommentValue = this.changeCommentValue.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleAddLike = this.handleAddLike.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
  }

  public render() {
    if (this.state.isFetching || this.state.fetchingPostUserInteractions) {
      return <div>Loading...</div>;
    }

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
            <a className={styles.post_author} href={"/user/" + this.props.id}>
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
                {this.getDropdownButtons()}
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
          {this.getTags()}
          <div className={styles.post_stats}>
            <fieldset className="rate">
              <div className="star-ratings-css">
                {this.handleStars()}
                <div className="star-ratings-css-bottom">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
              </div>
            </fieldset>
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
          <PostModal {...this.props} tags={this.state.tags} />
          {/* Delete Post */}
          <DeleteModal {...this.props} />
          {/* Report Post */}
          <ReportModal
            postId={this.props.id}
            reportCancelHandler={this.handleReportCancel}
          />
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
                image="http://cosmicgirlgames.com/images/games/morty.gif"
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
      </div>
    );
  }

  public componentDidMount() {
    this.apiGetPostUserInteractions();
    this.apiGetPostUserReport();

    let currentPage;
    if (this.props.comments === [] || this.props.comments === undefined) {
      currentPage = 1;
    } else {
      currentPage = Math.ceil(this.props.comments.length / 5);
    }

    const tagsFilter: any[] = [];

    this.props.tags.map(tag => {
      tagsFilter.push(tag.name);
    });

    this.setState({
      activePage: currentPage,
      isFetching: false,
      postID: this.props.id,
      tags: tagsFilter
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

  public handleStars() {
    const userRate =
      (this.state.userRateTotal / this.state.numberOfRatings) * 1.1;

    if (!this.state.postRated) {
      return (
        <div className="star-ratings-css-top" id="rate">
          <span id="5" onClick={this.handlePostRate}>
            ★
          </span>
          <span id="4" onClick={this.handlePostRate}>
            ★
          </span>
          <span id="3" onClick={this.handlePostRate}>
            ★
          </span>
          <span id="2" onClick={this.handlePostRate}>
            ★
          </span>
          <span id="1" onClick={this.handlePostRate}>
            ★
          </span>
        </div>
      );
    } else {
      return (
        <div className="star-ratings-css-top" style={{ width: userRate }}>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      );
    }
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
      divStyle.color = "blue";
      return (
        <div>
          <i className="fas fa-thumbs-up" style={divStyle} />
          <span>Like</span>
        </div>
      );
    } else {
      divStyle.color = "black";
      return (
        <div>
          <i className="fas fa-thumbs-up" style={divStyle} />
          <span>Like</span>
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

  public handlePostReport() {
    this.setState({ userReport: true });
  }

  public handleReportCancel() {
    this.setState({ userReport: false });
  }

  public handlePostRate(e: any) {
    if (this.state.postRated) {
      console.log("You already rated this post");
    } else {
      const rateTarget = e.target.id;

      const incrementRate = Number(this.state.numberOfRatings) + 1;
      this.setState({
        numberOfRatings: incrementRate
      });
      const userRating =
        (Number(this.state.userRateTotal) + parseInt(rateTarget, 10) * 20) /
        incrementRate;
      let body = {};
      body = {
        evaluator: this.userId,
        newPostRating: userRating,
        rate: parseInt(rateTarget, 10)
      };

      console.log("Post Rating updated to: ", userRating);
      const apiUrl = getApiURL(`/post/${this.props.id}/rate`);
      return axios
        .post(apiUrl, body)
        .then(() => {
          this.setState({
            postRated: true,
            userRateTotal:
              this.state.userRateTotal + parseInt(rateTarget, 10) * 20
          });
        })
        .catch(() => {
          console.log("Rating system failed");
        });
    }
  }

  public handlePostSubscription() {
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

    this.apiSubscription(endpoint);
  }

  public apiSubscription(endpoint: string) {
    apiSubscription("post", endpoint, this.userId, this.props.id)
      .then(() => {
        this.setState({
          waitingSubscriptionRequest: false
        });
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
        this.setState({
          fetchingPostUserInteractions: false,
          numberOfRatings: res.data.totalRatingsNumber,
          userRate: res.data.rate,
          userRateTotal: res.data.totalRatingAmount,
          userSubscription: res.data.subscription
        });
        if (!(this.state.userRate == null)) {
          this.setState({
            postRated: true
          });
        }
      })
      .catch(() => console.log("Failed to get post-user interactions"));
  }

  public async apiGetPostUserReport() {
    const userReport: boolean = await apiCheckPostUserReport(
      this.props.id,
      this.userId
    );
    this.setState({ userReport });
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

  public getCommentSection() {
    if (this.props.comments === [] || this.props.comments === undefined) {
      return <div className={`${styles.post_comment} w-100`} />;
    }

    let currentComments: any[] = [];
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
    const likesDiv: any[] = [];
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

  private getPagination() {
    if (
      this.props.comments === [] ||
      this.props.comments === undefined ||
      this.props.comments.length < 6
    ) {
      return;
    }

    const pageNumbersInd: number[] = [];
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

  private handleImageClick(src: string | undefined) {
    if (src) {
      document.body.style.overflow = "hidden";
      this.setState({
        clickedImage: src
      } as IState);
    }
  }

  private handleOverlayClick() {
    document.body.style.overflow = "scroll";
    this.setState({
      clickedImage: undefined
    } as IState);
  }

  private renderOverlay() {
    if (this.state.clickedImage !== undefined) {
      return (
        <div className={styles.overlay} onClick={this.handleOverlayClick}>
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
          <PostImageCarousel
            key={"i_" + this.props.id}
            id={this.props.id}
            images={this.state.images}
            parent={this}
            handleImageClick={this.handleImageClick}
          />
        );
      } else if (this.state.images.length === 1) {
        const image = this.state.images[0];
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
    if (this.state.videos.length) {
      if (this.state.videos.length >= 2) {
        return (
          <PostVideoCarousel
            key={"v_" + this.props.id}
            id={this.props.id}
            videos={this.state.videos}
          />
        );
      } else {
        const video = this.state.videos[0];
        return (
          <div className={"overflow-hidden " + styles.post_content_media}>
            <video src={video.src} controls={true} />
          </div>
        );
      }
    }
  }

  private getDropdownButtons() {
    const reportButton = (
      <button
        key={0}
        className={`dropdown-item ${styles.report_content}`}
        type="button"
        data-toggle="modal"
        data-target={`#report_post_modal_${this.props.id}`}
        onClick={this.handlePostReport}
        disabled={this.state.userReport}
      >
        {this.state.userReport ? "Report already issued" : "Report post"}
      </button>
    );
    const editButton = (
      <button
        key={1}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target={`#post_modal_Edit_${this.props.id}`}
      >
        Edit Post
      </button>
    );
    const deleteButton = (
      <button
        key={2}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target={`#delete_post_modal_${this.props.id}`}
      >
        Delete Post
      </button>
    );
    const dropdownButtons = [reportButton, editButton, deleteButton];
    return dropdownButtons;
  }

  private getFiles() {
    const filesDiv: any[] = [];

    if (this.state.docs.length) {
      for (const file of this.state.docs) {
        filesDiv.push(
          <PostFile key={file.name} file={file} id={this.props.id} />
        );
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
        if (file.mimetype.startsWith("image")) {
          this.state.images.push(file);
        } else if (file.mimetype.startsWith("video")) {
          this.state.videos.push(file);
        } else {
          this.state.docs.push(file);
        }
      });
    }
  }

  private getTags() {
    const tagsDiv: any[] = [];

    // sorting tags alphabetically
    this.props.tags.sort((a, b) =>
      (a.name || "").toString().localeCompare((b.name || "").toString())
    );

    if (this.props.tags.length > 0) {
      for (const tag of this.props.tags) {
        tagsDiv.push(
          <span
            key={"tags_" + tag.name + "post_" + this.props.id}
            className={`${styles.tags} d-inline badge`}
          >
            <a key={"tags_" + tag.name + "post_" + this.props.id}>
              #{tag.name}
            </a>
          </span>
        );
      }
    } else {
      return;
    }

    return (
      <div className={`${styles.post_tags} w-100 container`}>
        <div className="row justify-content-center align-items-center">
          {tagsDiv}
        </div>
      </div>
    );
  }
}

export default Post;

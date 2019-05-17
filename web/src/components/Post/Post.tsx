import React, { Component } from "react";

// - Import styles
import styles from "./Post.module.css";

// - Import app components
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import ImagePreloader from "../ImagePreloader/ImagePreloader";
import PostFile from "../PostFile/PostFile";
import PostImageCarousel from "../PostImageCarousel/PostImageCarousel";
import DeleteModal from "../PostModal/DeleteModal";
import InviteModal from "../PostModal/InviteModal";
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
import { dictionary, LanguageContext } from "../../utils/language";
import { getApiURL } from "../../utils/apiURL";

import {
  faGlobeAfrica,
  faLock,
  faQuestion,
  faUserFriends,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import AuthHelperMethods from "../../utils/AuthHelperMethods";
import axiosInstance from "../../utils/axiosInstance";
import Icon from "../Icon/Icon";
import PostVideoCarousel from "../PostVideoCarousel/PostVideoCarousel";

export type Props = {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string | undefined;
  visibility: string;
  comments: any[];
  files?: MyFile[];
  tags: any[];
  user_id: number;
};

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

class Post extends Component<Props, IState> {
  public static contextType = LanguageContext;

  constructor(props: Props) {
    super(props);

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
    this.handlePostUpdateRate = this.handlePostUpdateRate.bind(this);
    this.handlePostSubscription = this.handlePostSubscription.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.changeCommentValue = this.changeCommentValue.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
  }

  public render() {
    if (this.state.isFetching || this.state.fetchingPostUserInteractions) {
      return null;
    }

    console.log(this.state.images);
    console.log(this.state.videos);

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
              href={"/user/" + this.props.user_id}
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
                {this.getDropdownButtons()}
              </div>
            </div>
          </div>
          <div className={styles.post_content_text}>
            <h4> {this.props.title} </h4>
          </div>
          <div className={styles.post_content_text}>
            <p> {this.props.content} </p>
          </div>
          {this.getImages()}
          {this.getVideos()}
          {this.getFiles()}
          {this.getTags()}
          <div className={styles.post_stats}>
            <span>
              {" "}
              {this.props.comments.length} {dictionary.comments[this.context]}
            </span>
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
          </div>
          {this.getUserInteractionButtons()}
          {/* Invite users to post */}
          <InviteModal postId={this.props.id} />
          {/* Report Post */}
          <ReportModal
            postId={this.props.id}
            reportCancelHandler={this.handleReportCancel}
          />
          {/* Post edition modal */}
          <PostModal {...this.props} tags={this.state.tags} />
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
                image="http://cosmicgirlgames.com/images/games/morty.gif"
              />
              <textarea
                className={`form-control ml-4 mr-3 ${this.getInputRequiredClass(
                  this.state.commentValue
                )}`}
                placeholder={
                  dictionary.insert_comment_placeholder[this.context]
                }
                value={this.state.commentValue}
                onChange={this.changeCommentValue}
                onKeyDown={this.onEnterPress}
                required={true}
              />
              <button
                className={`${styles.submit_comment} px-2 py-1`}
                type="submit"
                value={dictionary.submit[this.context]}
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
    const postUrl = `/post/${this.state.postID}/comment`;

    axiosInstance
      .post(postUrl, {
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
      (this.state.userRateTotal / this.state.numberOfRatings) * 1.12;

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
        <div
          className="star-ratings-css-top"
          id="update-rate"
          style={{ width: userRate }}
        >
          <span id="1">★</span>
          <span id="2">★</span>
          <span id="3">★</span>
          <span id="4">★</span>
          <span id="5">★</span>
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

  public async handlePostRate(e: any) {
    const rateTarget = e.target.id;

    const incrementRate = Number(this.state.numberOfRatings) + 1;
    this.setState({
      numberOfRatings: incrementRate
    });
    const userRating = Math.round(
      (Number(this.state.userRateTotal) + parseInt(rateTarget, 10) * 20) /
        incrementRate
    );
    const body = {
      newPostRating: userRating,
      rate: parseInt(rateTarget, 10)
    };

    console.log("Post Rating updated to: ", userRating);
    const apiUrl = `/post/${this.props.id}/rate`;
    try {
      await axiosInstance.post(apiUrl, body);
      this.setState({
        postRated: true,
        userRate: parseInt(rateTarget, 10) * 20,
        userRateTotal: this.state.userRateTotal + parseInt(rateTarget, 10) * 20
      });
      console.log("RATE: ", this.state.userRate);
    } catch (e) {
      console.log("Rating system failed");
    }
  }

  public async handlePostUpdateRate(e: any) {
    const rateTarget = e.target.id;

    let formerRate = this.state.userRate;
    if (formerRate < 6) {
      formerRate = formerRate * 20;
    }
    const userRating = Math.round(
      (Number(this.state.userRateTotal) +
        parseInt(rateTarget, 10) * 20 -
        formerRate) /
        Number(this.state.numberOfRatings)
    );
    const body = {
      newPostRating: userRating,
      rate: parseInt(rateTarget, 10)
    };
    console.log("TOTAL:", this.state.userRateTotal);
    console.log("NUmber of ratings:", this.state.numberOfRatings);
    console.log("Former rating: ", formerRate);
    console.log("Post Rating updated to: ", userRating);
    const apiUrl = `/post/${this.props.id}/rate`;
    try {
      await axiosInstance.put(apiUrl, body);
      this.setState({
        userRate: parseInt(rateTarget, 10) * 20,
        userRateTotal:
          this.state.userRateTotal + parseInt(rateTarget, 10) * 20 - formerRate
      });
      console.log("RATE UPDATED: ", this.state.userRate);
    } catch (e) {
      console.log("Updating rating system failed");
    }
  }

  public handlePostSubscription() {
    if (this.state.waitingSubscriptionRequest) {
      console.log(
        "Error trying subscription action! Waiting for response from last request"
      );
      return;
    }

    const method = this.state.userSubscription ? "delete" : "post";
    const subscriptionState = !this.state.userSubscription;

    this.setState({
      userSubscription: subscriptionState,
      waitingSubscriptionRequest: true
    });

    this.apiSubscription(method);
  }

  public apiSubscription(method: string) {
    apiSubscription("post", method, this.props.id)
      .then(() => {
        this.setState({
          waitingSubscriptionRequest: false
        });
      })
      .catch(() => {
        this.setState({
          userSubscription: method === "delete",
          waitingSubscriptionRequest: false
        });
        console.log("Subscription system failed");
      });
  }

  public apiGetPostUserInteractions() {
    apiGetUserInteractions("post", this.props.id)
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
    const userReport: boolean = await apiCheckPostUserReport(this.props.id);
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

  private getUserInteractionButtons() {
    const subscribeIcon = this.state.userSubscription
      ? "fas fa-bell-slash"
      : "fas fa-bell";
    const subscribeBtnText = this.state.userSubscription
      ? dictionary.unsubscribe_action[this.context]
      : dictionary.subscribe_action[this.context];

    return (
      <div className={styles.post_actions}>
        <button onClick={this.handlePostSubscription}>
          <i className={subscribeIcon} />
          <span>{subscribeBtnText}</span>
        </button>
        <button>
          <i className="far fa-comment-alt" />
          <span>{dictionary.comment_action[this.context]}</span>
        </button>
        <button>
          <i className="fas fa-share-square" />
          <span>{dictionary.share_action[this.context]}</span>
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
    const inviteButton = (
      <button
        key={0}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target={`#invite_post_modal_${this.props.id}`}
      >
        {dictionary.invite_discussion[this.context]}
      </button>
    );
    const reportButton = (
      <button
        key={1}
        className={`dropdown-item ${styles.report_content}`}
        type="button"
        data-toggle="modal"
        data-target={`#report_post_modal_${this.props.id}`}
        onClick={this.handlePostReport}
        disabled={this.state.userReport}
      >
        {this.state.userReport
          ? dictionary.report_post_issued[this.context]
          : dictionary.report_post[this.context]}
      </button>
    );
    const editButton = (
      <button
        key={2}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target={`#post_modal_Edit_${this.props.id}`}
      >
        {dictionary.edit_post[this.context]}
      </button>
    );
    const deleteButton = (
      <button
        key={3}
        className="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target={`#delete_post_modal_${this.props.id}`}
      >
        {dictionary.delete_post[this.context]}
      </button>
    );
    const dropdownButtons = [
      inviteButton,
      reportButton,
      editButton,
      deleteButton
    ];
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

  private updateFileSrc(file: MyFile) {
    let url = getApiURL("/post/" + this.props.id + "/" + file.name);

    return axiosInstance
      .get(url, {
        responseType: "arraybuffer"
      })
      .then(res => {
        file.src =
          "data:" +
          file.mimetype +
          ";base64, " +
          new Buffer(res.data, "binary").toString("base64");
        this.forceUpdate();
      });
  }

  private initFiles() {
    if (this.props.files) {
      Array.from(this.props.files).forEach(file => {
        if (file.mimetype.startsWith("image")) {
          this.state.images.push(file);
          this.updateFileSrc(file);
        } else if (file.mimetype.startsWith("video")) {
          this.state.videos.push(file);
          this.updateFileSrc(file);
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

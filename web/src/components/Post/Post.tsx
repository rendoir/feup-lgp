// - Import react components
import axios from "axios";
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
import VideoPreloader from "../VideoPreloader/VideoPreloader";

// - Import utils
import { apiSubscription } from "../../utils/apiSubscription";
import { apiGetUserInteractions } from "../../utils/apiUserInteractions";

type Props = {
  id: number;

  title: string;

  date: string | undefined;

  images: string[] | undefined;

  videos: string[] | undefined;

  author: string;

  text: string | undefined;

  comments: any[];
};

type State = {
  isHovered: boolean;
  data: any;
  fetchingPostUserInteractions: boolean;
  userRate: number;
  userSubscription: boolean;
  waitingRateRequest: boolean;
  waitingSubscriptionRequest: boolean;
};

const cookies = new Cookies();

class Post extends Component<Props, State> {
  public static defaultProps = {};
  public id: string;
  public userId: number;

  constructor(props: Props) {
    super(props);

    this.id = "post_" + this.props.id;
    this.userId = 1; // cookies.get("user_id"); - change when login fetches user id properly
    console.log("Cookie user ID: ", cookies.get("user_id"));

    this.state = {
      data: "",
      fetchingPostUserInteractions: true,
      isHovered: false,
      userRate: 0,
      userSubscription: false,
      waitingRateRequest: false,
      waitingSubscriptionRequest: false
    };
    console.log("rate: ", this.state.userRate);
    console.log("subscription: ", this.state.userSubscription);

    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handlePostRate = this.handlePostRate.bind(this);
    this.handlePostSubscription = this.handlePostSubscription.bind(this);
  }

  public render() {
    if (this.state.fetchingPostUserInteractions) {
      return null;
    }

    console.log(this.state);

    return (
      <div className={`${styles.post} mb-4`}>
        <div className={styles.post_header}>
          <Avatar
            title={this.props.author}
            placeholder="empty"
            size={30}
            image="https://picsum.photos/200/200?image=52"
          />
          <a className={styles.post_author} href={"/user/" + this.props.author}>
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
        <div className={styles.post_content}>
          <h4> {this.props.title} </h4>
        </div>
        <div className={styles.post_content}>
          <p> {this.props.text} </p>
        </div>
        {this.getImages()}
        {this.getVideos()}
        <div className={styles.post_stats}>
          <span>35 likes</span>
          <span>14 comments</span>
        </div>
        {this.getUserInteractionButtons()}
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
    );
  }

  public componentDidMount() {
    this.apiGetPostUserInteractions();
  }

  public handleDeletePost() {
    console.log("DELETE POST");
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

  private getUserInteractionButtons() {
    const subscribeIcon = this.state.userSubscription
      ? "fas fa-bell-slash"
      : "fas fa-bell";
    const subscribeBtnText = this.state.userSubscription
      ? "Unsubscribe"
      : "Subscribe";

    return (
      <div className={styles.post_actions}>
        <button onClick={this.handlePostRate}>
          <i className="fas fa-thumbs-up" />
          <span>Like</span>
        </button>
        <button>
          <i className="far fa-comment-alt" />
          <span>Comment</span>
        </button>
        <button onClick={this.handlePostSubscription}>
          <i className={subscribeIcon} />
          <span>{subscribeBtnText}</span>
        </button>
        <button>
          <i className="fas fa-share-square" />
          <span>Share</span>
        </button>
      </div>
    );
  }
}

export default Post;
